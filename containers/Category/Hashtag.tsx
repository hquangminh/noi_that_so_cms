import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useLazyQuery, useMutation } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Space, Table, Typography } from 'antd';
import { CardTabListType } from 'antd/es/card';
import { ColumnsType } from 'antd/es/table';

import { removeEmptyObject } from 'functions';
import { handleErrorCatch } from 'lib/utils';
import { hashtagType } from 'common/constants';
import { API_GetHashtag } from 'graphql/category/query';
import { API_DeleteHashtag } from 'graphql/category/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import HashtagForm from 'components/Pages/Category/FormHashtag';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';
import FilterPanelHashtag from 'components/Pages/Category/FilterPanelHashtag';

import { HashtagItem } from 'interface/Category';

type ResponseType = { hashtag: HashtagItem[]; hashtag_aggregate: { aggregate: { count: number } } };

const CategoryHashtagContainer = () => {
  const router = useRouter();
  const [modal, contextModal] = Modal.useModal();
  const [deleteHashtag] = useMutation(API_DeleteHashtag);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [dataForm, setDataForm] = useState<HashtagItem | undefined>();

  const [fetchHashtag, { data, loading, refetch: fetchNewHashtag }] = useLazyQuery<ResponseType>(
    API_GetHashtag,
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data.hashtag.length === 0 && router.query.page && router.query.page !== '1') onChangePage();
      },
      onError: handleErrorCatch,
    },
  );

  const onFetchHashtag = useCallback(() => {
    const { tab, name, status, count, page } = router.query;

    let filter: Record<string, any> = {};
    let sort: Record<string, string>[] = [{ name: 'asc' }];

    if (!tab || tab === 'portfolio') filter['type'] = { _eq: 2 };
    else if (tab === 'product') filter['type'] = { _eq: 1 };
    else if (tab === 'blog') filter['type'] = { _eq: 3 };

    if (status === 'true') filter['status'] = { _eq: true };
    else if (status === 'false') filter['status'] = { _eq: false };

    if (name && name.toString().trim()) filter['name'] = { _ilike: `%${name.toString().trim()}%` };

    if (count === 'ascending') sort.unshift({ count: 'asc' });
    else sort.unshift({ count: 'desc' });

    fetchHashtag({ variables: { filter, sort, offset: (Number(page ?? 1) - 1) * 10 } });
  }, [router, fetchHashtag]);

  useEffect(() => {
    onFetchHashtag();
  }, [onFetchHashtag]);

  const onChangeTab = (tab: string) =>
    router.replace({ query: removeEmptyObject({ ...router.query, tab, page: undefined }) }, undefined, {
      shallow: true,
    });

  const onChangePage = (page?: number) =>
    router.replace({ query: removeEmptyObject({ ...router.query, page }) }, undefined, { shallow: true });

  const handleEdit = (hashtag: HashtagItem) => {
    setDataForm(hashtag);
    setOpenForm(true);
  };

  const handleConfirmDelete = (hashtagID: number) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa hashtag này?',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          deleteHashtag({ variables: { id: hashtagID } }),
        ])
          .then(fetchNewHashtag)
          .catch(handleErrorCatch),
    });
  };

  const columns: ColumnsType<HashtagItem> = [
    { key: 'name', title: 'Tên', dataIndex: 'name' },
    { key: 'type', title: 'Phân loại', render: (_, { type }) => hashtagType[type] },
    { key: 'count', title: 'Lượt tìm kiếm', dataIndex: 'count' },
    {
      key: 'status',
      title: 'Kích hoạt',
      dataIndex: 'status',
      align: 'center',
      render: (status) => <IconCheckOrUncheck checked={status} />,
    },
    {
      key: 'action',
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => {
        return (
          <Space split={<Divider type='vertical' />}>
            <a onClick={() => handleEdit(record)}>
              <Typography.Text type='warning'>Sửa</Typography.Text>
            </a>
            <a onClick={() => handleConfirmDelete(record.id)}>
              <Typography.Text type='danger'>Xóa</Typography.Text>
            </a>
          </Space>
        );
      },
    },
  ];

  const ButtonAdd = (
    <Button type='primary' icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
      Thêm Hashtag
    </Button>
  );

  return (
    <Fragment>
      <FilterPanelHashtag />

      <SectionContent
        tabList={TabList}
        activeTabKey={router.query.tab?.toString() ?? 'portfolio'}
        onTabChange={onChangeTab}
        tabBarExtraContent={ButtonAdd}
      >
        <Table
          rowKey='id'
          loading={loading}
          columns={columns}
          dataSource={data?.hashtag}
          pagination={{
            current: Number(router.query.page) || 1,
            total: data?.hashtag_aggregate.aggregate.count,
            onChange: onChangePage,
          }}
        />
      </SectionContent>

      <HashtagForm
        open={openForm}
        data={dataForm}
        onClose={() => {
          setDataForm(undefined);
          setOpenForm(false);
        }}
        onSuccess={fetchNewHashtag}
      />

      {contextModal}
    </Fragment>
  );
};

export default CategoryHashtagContainer;

const TabList: CardTabListType[] = [
  { key: 'portfolio', label: 'Ý tưởng thiết kế' },
  { key: 'product', label: 'Sản phẩm' },
  { key: 'blog', label: 'Bài viết' },
];

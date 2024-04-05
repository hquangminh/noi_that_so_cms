import SectionContent from 'components/Fragments/SectionContent';
import FormItemTextEditor from 'components/Fragments/FormItemTextEditor';

const ProductFormDescription = () => {
  return (
    <SectionContent title='Mô tả sản phẩm'>
      <FormItemTextEditor
        name='description'
        rules={[{ whitespace: true, message: 'Mô tả sản phẩm không được chứa mỗi khoảng trắng' }]}
      />
    </SectionContent>
  );
};

export default ProductFormDescription;

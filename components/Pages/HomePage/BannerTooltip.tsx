import { Fragment } from 'react';

export function TitleTooltip() {
  return (
    <Fragment>
      <img src='/static/images/banner/title-tooltip.webp' alt='' width='100%' />
      <br /> <br />
      <ul style={{ paddingLeft: 25 }}>
        <li>
          Sử dụng <strong>{'<br />'}</strong> hoặc bấm <strong>Enter</strong> để xuống dòng
        </li>
        <li>
          Sử dụng <strong>{'<span>Nội dung</span>'}</strong> để chữ có màu chủ đạo
        </li>
      </ul>
    </Fragment>
  );
}

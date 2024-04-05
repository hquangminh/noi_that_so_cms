import { Design } from 'react-email-editor';

const isUnlayerEmpty = (design: Design) => {
  let isEmpty = true;
  const { rows } = design.body;
  for (let i = 0; i < rows.length; i++) {
    const { columns } = rows[i] as any;
    for (let j = 0; j < columns.length; j++) {
      if (columns[j].contents.length) {
        isEmpty = false;
        break;
      }
    }
  }
  return isEmpty;
};

export default isUnlayerEmpty;

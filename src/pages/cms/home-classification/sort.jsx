import React, { useState, useEffect } from 'react';
import { Button, Image } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import { arrayMove, SortableElement, SortableContainer } from 'react-sortable-hoc';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: '16px',
  maxHeight: 700,
  overflow: 'auto',
  textAlign: 'center',
};

const gridItemStyles = {
  width: '100%',
  height: 100,
  // backgroundColor: '#e5e5e5',
  zIndex: 9999,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const GridItem = SortableElement(({ value }) =>
  <div style={gridItemStyles}>
    <img src={value.gcIcon} width="50" height="50" />
    <div width="50" height="50">{value.gcName}</div>
  </div>
);

const Grid = SortableContainer(({ items }) =>
  <div style={gridStyles}>
    {items.map((value, index) =>
      <GridItem
        id={value.id}
        key={index}
        index={index}
        value={value}
      />
    )}
  </div>
);

const ClassSort = ({ callback, data }) => {

  const [items, setItems] = useState([])

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  useEffect(() => {
    setItems(data)
  }, [data])

  return (
    <ModalForm
      title="编辑排序"
      modalProps={{
        width: 900,
      }}
      trigger={
        <Button type="primary" >
          编辑排序
        </Button>
      }
      onFinish={() => {
        callback(items);
        return true;
      }}
    >
      <Grid distance={1} items={items} onSortEnd={onSortEnd} axis="xy" />
    </ModalForm >
  )
}

export default ClassSort;


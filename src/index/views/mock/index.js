import Mock from 'mockjs';

const allDatas = [
  {
    path: '/hdAgvCallMaterial/selectWorkcenterUsers',
    type: 'post',
    data: {
      code: '0',
      errMsg: null,
      msg: "Success",
      data: {
        'list|5': [
          {
            'id|+1': 1,
            workcenterCode: function() {
              return 'AAAA-' + Math.floor(Math.random() * 10)
            },
            workcenterDesc: function() {
              return this.workcenterCode
            },
            workcenterName: function() {
              return this.workcenterCode
            }
          }
        ],
        offset: 5,
        pageNo: 1,
        pageSize: 5,
        totalCount: 11,
        totalPage: 3,
      }
    }
  }
];

const productDatas = (datas) => {
  datas.forEach(item => {
    Mock.mock(new RegExp(item.path), item.type, item.data);
  });
};
console.log(Mock);
productDatas(allDatas);

title: Sequelize 关系模型建立与操作
tag:
    -SQL
date: 2020-5-9 14:02:00
---

墨子项目服务接口部分的开发虽然量非常多但是大部分都是数据的 (CRUD) 操作, 选择一个合适的 ORM 框架比较重要. 大佬推荐了 `Sequelize` 就入门的学习了一下基本用法 .

## Model
`Sequelize` 中最重要的概率就是 Model , 所有的数据操作都是基于 Model 进行的,  所以只要定义清楚了 Model  后面的工作就非常轻松了

### definition
模型的定义就是把数据表结构通过代码声明一遍, 也是有个库可以自动生成的 [sequelize-auto](https://github.com/sequelize/sequelize-auto)  当前项目数据结构也不复杂就没有用

```
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'TestService',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      name: DataTypes.STRING(45)
    },
    {
      tableName: 'db_test_service_base'
    },
  )
}
```

### import model

```
sequelize.inport('model path')
```

### 数据操作
- 增: `TestService.create({})`
- 删: `TestService.destroy({})`
- 查: `TestService.findById() / TestService.findAll()`
- 改: `TestService.findById().update({})`


单表模型这样就可以了,  如果希望查 TestService 的时候一起把关联的 TestFunction 信息也查出来就需要建立 Model 之间的关系

## 关系模型
- hasOne : 一对一 (1:1)
- belongsTo : 一对一 (1:1)  和 hasOne 的区别在于外键存在源表中
- hasMany : 一堆多(1:N)
- belongsToMany : 多对多(N:N)

## 定义关系
```
// function model
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
		'TestFunction',
		{
			id: DataTypes.INTEGER(10).UNSIGNED,
			serviceId: DataTypes.INTEGER(10).UNSIGNED
		}
	)
}


// service model
module.exports = function(sequelize, DataTypes) {
  const TestService = sequelize.define(
    'TestService',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      name: DataTypes.STRING(45)
    },
    {
      tableName: 'db_test_service_base'
    },
  )
	
	// 开始建立关系
	TestService.associate = function(models) {
		const foreignKey = 'service_id'
	    const sourceKey = 'id
		
		models.TestService.hasMany(models. TestFunction, {
			as: 'functions',
			foreignKey,
			sourceKe
		})
	}	

	return TestService
}
```


## 关联数据查询
关键字: `include` 默认是左外连接

```
TestService.findById(id,{
	include: {
		module: TestFunction,
		as: 'functions'
  }
})
```

## 关联数据创建
```
const service = await TestService.create({})
// 向 service 中添加 function
await service.createTestFunction({})
```


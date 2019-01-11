import { UpdateModel } from '../../../test/models'
import { Metadata, metadataForClass } from '../../decorator/metadata'
import { createKeyAttributes } from '../../mapper'
import { update2 } from '../expression/logical-operator/update.function'
import { getTableName } from '../get-table-name.function'
import { TransactUpdate } from './transact-update'

describe('TransactUpdate', () => {
  let op: TransactUpdate<UpdateModel>
  let metadata: Metadata<UpdateModel>
  let now: Date
  beforeEach(() => {
    op = new TransactUpdate(UpdateModel, 'myId')
    now = new Date()
    metadata = metadataForClass(UpdateModel)
  })

  afterEach(() => {
    expect(op.transactItem).toEqual({
      Update: {
        TableName: getTableName(UpdateModel),
        Key: createKeyAttributes(metadata, 'myId'),

        UpdateExpression: 'SET #lastUpdated = if_not_exists(#lastUpdated, :lastUpdated)',
        ConditionExpression: '#name = :name',

        ExpressionAttributeNames: {
          '#lastUpdated': 'lastUpdated',
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':lastUpdated': { S: now.toISOString() },
          ':name': { S: 'Foo Bar' },
        },
      },
    })
  })

  it('correct transactItem [operations]', () => {
    op.operations(update2(UpdateModel, 'lastUpdated').set(now, true))
      .onlyIfAttribute('name')
      .eq('Foo Bar')
  })

  it('correct transactItem [updateAttribute]', () => {
    op.updateAttribute('lastUpdated')
      .set(now, true)
      .onlyIfAttribute('name')
      .eq('Foo Bar')
  })
})
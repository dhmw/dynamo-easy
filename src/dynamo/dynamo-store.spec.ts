import { EMPTY } from 'rxjs'
import { SimpleWithPartitionKeyModel } from '../../test/models'
import { updateDynamoEasyConfig } from '../config'
// tslint:disable:max-classes-per-file
// tslint:disable:no-unnecessary-class
// tslint:disable:no-unused-expression
import { Model } from '../decorator/impl'
import { DEFAULT_TABLE_NAME_RESOLVER } from './default-table-name-resolver.const'
import { DynamoStore } from './dynamo-store'
import {
  BatchGetSingleTableRequest,
  DeleteRequest,
  GetRequest,
  PutRequest,
  QueryRequest,
  ScanRequest,
  UpdateRequest,
} from './request'
import { BatchWriteSingleTableRequest } from './request/batchwritesingletable/batch-write-single-table.request'

@Model()
class DynamoStoreModel {}

@Model({ tableName: 'myTableName' })
class DynamoStoreModel2 {}

describe('dynamo store', () => {

  describe('table name', () => {
    it('correct table name - default', () => {
      const dynamoStore = new DynamoStore(DynamoStoreModel)
      expect(dynamoStore.tableName).toBe('dynamo-store-models')
    })

    it('correct table name - by decorator', () => {
      const dynamoStore = new DynamoStore(DynamoStoreModel2)
      expect(dynamoStore.tableName).toBe('myTableName')
    })

    it('correct table name - by tableNameResolver', () => {
      const dynamoStore = new DynamoStore(DynamoStoreModel2, tableName => `${tableName}-with-special-thing`)
      expect(dynamoStore.tableName).toBe('myTableName-with-special-thing')
    })

    it('throw error because table name is invalid', () => {
      // tslint:disable-next-line:no-unused-expression
      expect(() => new DynamoStore(DynamoStoreModel2, tableName => `${tableName}$`)).toThrowError()
    })
  })

  describe('session validity ensurer', () => {
    let validityEnsurerSpy: jasmine.Spy
    beforeEach(() => {
      validityEnsurerSpy = jasmine.createSpy().and.returnValue(EMPTY)
    })
    it('custom session validity ensurer is used', async () => {
      const store = new DynamoStore(DynamoStoreModel, DEFAULT_TABLE_NAME_RESOLVER, validityEnsurerSpy)
      await store.scan().exec().toPromise()
      expect(validityEnsurerSpy).toHaveBeenCalled()
    })
  })

  describe('logger', () => {
    let logReceiverSpy: jasmine.Spy
    beforeEach(() => {
      logReceiverSpy = jasmine.createSpy()
      updateDynamoEasyConfig({ logReceiver: logReceiverSpy })
    })
    it('logs when instance was created', () => {
      new DynamoStore(DynamoStoreModel)
      expect(logReceiverSpy).toHaveBeenCalled()
    })
  })

  describe('should create request objects', () => {
    let store: DynamoStore<SimpleWithPartitionKeyModel>
    beforeEach(() => store = new DynamoStore(SimpleWithPartitionKeyModel))

    it('put', () => expect(store.put({ id: 'id', age: 0 }) instanceof PutRequest).toBeTruthy())
    it('get', () => expect(store.get('id') instanceof GetRequest).toBeTruthy())
    it('update', () => expect(store.update('id') instanceof UpdateRequest).toBeTruthy())
    it('delete', () => expect(store.delete('id') instanceof DeleteRequest).toBeTruthy())
    it('batchWrite', () => expect(store.batchWrite() instanceof BatchWriteSingleTableRequest).toBeTruthy())
    it('scan', () => expect(store.scan() instanceof ScanRequest).toBeTruthy())
    it('query', () => expect(store.query() instanceof QueryRequest).toBeTruthy())
    it('batchGetItem', () => expect(store.batchGetItem([{id:'id'}]) instanceof BatchGetSingleTableRequest).toBeTruthy())
  })

  describe('should enable custom requests', () => {
    const makeRequestSpy = jasmine.createSpy().and.returnValue(EMPTY)
    const store = new DynamoStore(SimpleWithPartitionKeyModel)
    Object.assign(store, { dynamoRx: { makeRequest: makeRequestSpy } })
    store.makeRequest('updateTimeToLive', {})
    expect(makeRequestSpy).toBeCalled()
  })

  describe('allow to get dynamodb instance', () => {
    const store = new DynamoStore(SimpleWithPartitionKeyModel)
    expect(store.dynamoDb).toBeDefined()
  })

})

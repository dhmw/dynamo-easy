import { dynamoEasyConfig } from './dynamo-easy-config';
/**
 * update the global dynamoEasy {@link Config}
 */
export function updateDynamoEasyConfig(config) {
    if ('logReceiver' in config && typeof config.logReceiver !== 'function') {
        throw new Error('Config.logReceiver has to be a function');
    }
    if ('dateMapper' in config &&
        (!config.dateMapper ||
            typeof config.dateMapper.toDb !== 'function' ||
            typeof config.dateMapper.fromDb !== 'function')) {
        throw new Error('Config.dateMapper must be an object of type MapperForType');
    }
    if ('tableNameResolver' in config && typeof config.tableNameResolver !== 'function') {
        throw new Error('Config.tableNameResolver must be function');
    }
    if ('sessionValidityEnsurer' in config && typeof config.sessionValidityEnsurer !== 'function') {
        throw new Error('Config.sessionValidityEnsurer must be function');
    }
    Object.assign(dynamoEasyConfig, config);
}
//# sourceMappingURL=update-config.function.js.map
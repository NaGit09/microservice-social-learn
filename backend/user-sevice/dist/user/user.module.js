"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("../user/controllers/user.controller");
const user_kafka_1 = require("../user/controllers/user.kafka");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const kafkajs_1 = require("kafkajs");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'KAFKA_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.KAFKA,
                        options: {
                            client: {
                                clientId: config.get('KAFKA_CLIENT_ID') ?? 'auth-service',
                                brokers: [config.get('KAFKA_BROKER') ?? 'localhost:9092'],
                            },
                            consumer: {
                                groupId: config.get('KAFKA_GROUP_ID') ?? 'auth-consumer',
                            },
                            producer: {
                                createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner,
                            },
                        },
                    }),
                },
            ]),
        ],
        controllers: [user_controller_1.UserController, user_kafka_1.UserKafka],
        providers: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map
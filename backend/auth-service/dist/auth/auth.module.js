"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const mongoose_1 = require("@nestjs/mongoose");
const account_entity_1 = require("./entities/account.entity");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./utils/jwt.strategy");
const JwtRefresh_strategy_1 = require("./utils/JwtRefresh.strategy");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: account_entity_1.Account.name, schema: account_entity_1.AccountSchema }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({}),
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
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, JwtRefresh_strategy_1.JwtRefreshStrategy],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
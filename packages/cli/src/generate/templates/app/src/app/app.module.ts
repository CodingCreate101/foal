import { Authenticate, controller, Group, IModule, InitDB, Module, Permission } from '@foal/core';

import { ViewController } from './controllers';
import { User } from './entities';

@Module()
@InitDB([ Group, Permission, User ])
@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('/', ViewController),
  ];

  subModules = [

  ];
}

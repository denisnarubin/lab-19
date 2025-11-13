import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { TasksServiceRepository } from './tasks.service-repo';

@Module({
  controllers: [TasksController],
  providers: [TasksServiceRepository],
  imports: [TypeOrmModule.forFeature([Task, User])],
})
export class TasksModule {}

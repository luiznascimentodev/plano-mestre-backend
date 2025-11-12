import { TopicPriority } from '@prisma/client';
export declare class CreateTopicDto {
    name: string;
    category?: string;
    priority?: TopicPriority;
    dueDate?: string;
    description?: string;
    tags?: string;
    color?: string;
}

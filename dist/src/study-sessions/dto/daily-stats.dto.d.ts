export declare class DailyStatsDto {
    date: string;
    totalMinutes: number;
    sessionCount: number;
    topicsStudied: number;
    byTopic: Array<{
        topicId: number;
        topicName: string;
        totalMinutes: number;
        sessionCount: number;
    }>;
}

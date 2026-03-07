import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Memory {
    id: bigint;
    topic: string;
    content: string;
    sentiment: bigint;
    timestamp: bigint;
    botId: bigint;
    memoryType: string;
}
export interface Bot {
    id: bigint;
    personality: string;
    name: string;
    linkedWiki?: string;
    avatar: string;
}
export interface backendInterface {
    addMemory(botId: bigint, memoryType: string, content: string, topic: string, sentiment: bigint): Promise<bigint>;
    buildProjectJSON(topic: string, affirmations: Array<string>, boosterEnabled: boolean, fantasyEnabled: boolean, fantasyInput: string, protectionEnabled: boolean, chakraName: string, voiceType: string, voiceSpeed: number, voicePitch: number, repetitionCount: bigint, whisperOverlay: boolean, backgroundMusicType: string, subliminalFrequency: string, musicVolume: number, subliminalVolume: number, waveformOverlay: boolean, stereoMovement: boolean, themeStyle: string, colorPalette: string, resolution: string, durationSeconds: bigint, frameRate: bigint): Promise<string>;
    clearMemoriesForBot(botId: bigint): Promise<{
        removedCount: bigint;
    }>;
    createBot(name: string, avatar: string, personality: string, linkedWiki: string | null): Promise<bigint>;
    deleteBot(id: bigint): Promise<boolean>;
    deleteMemory(id: bigint): Promise<boolean>;
    deleteProject(id: bigint): Promise<boolean>;
    generateAffirmations(topic: string, boosterEnabled: boolean, fantasyEnabled: boolean, protectionEnabled: boolean, chakraName: string): Promise<Array<string>>;
    getAllBots(): Promise<Array<Bot>>;
    getAllChakras(): Promise<string>;
    getAllKinesisEntries(): Promise<string>;
    getBeliefSystems(): Promise<string>;
    getBot(id: bigint): Promise<Bot | null>;
    getFantasyMapping(abilityName: string): Promise<string>;
    getMemoriesForBot(botId: bigint): Promise<Array<Memory>>;
    getProject(id: bigint): Promise<string | null>;
    getRelevantMemories(botId: bigint, topic: string, topN: bigint): Promise<Array<Memory>>;
    listProjects(): Promise<Array<[bigint, string, bigint]>>;
    saveProject(title: string, jsonOutput: string): Promise<bigint>;
}

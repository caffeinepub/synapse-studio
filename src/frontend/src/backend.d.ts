import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    buildProjectJSON(topic: string, affirmations: Array<string>, boosterEnabled: boolean, fantasyEnabled: boolean, fantasyInput: string, protectionEnabled: boolean, chakraName: string, voiceType: string, voiceSpeed: number, voicePitch: number, repetitionCount: bigint, whisperOverlay: boolean, backgroundMusicType: string, subliminalFrequency: string, musicVolume: number, subliminalVolume: number, waveformOverlay: boolean, stereoMovement: boolean, themeStyle: string, colorPalette: string, resolution: string, durationSeconds: bigint, frameRate: bigint): Promise<string>;
    deleteProject(id: bigint): Promise<boolean>;
    generateAffirmations(topic: string, boosterEnabled: boolean, fantasyEnabled: boolean, protectionEnabled: boolean, chakraName: string): Promise<Array<string>>;
    getAllChakras(): Promise<string>;
    getAllKinesisEntries(): Promise<string>;
    getBeliefSystems(): Promise<string>;
    getFantasyMapping(abilityName: string): Promise<string>;
    getProject(id: bigint): Promise<string | null>;
    listProjects(): Promise<Array<[bigint, string, bigint]>>;
    saveProject(title: string, jsonOutput: string): Promise<bigint>;
}

export interface IRecordingInfo {
    isResultSent: boolean,
    resultSendingAttemptsCount: number,
    isActive: boolean,
    isCorrectEnded: boolean,
    egressId: string | null,
    recordingURL: string | null,
    isUpdatedACL: boolean,
    startAttemptsCount: number,
    updateACLAttemptsCount: number,
    startedAt: string | null,
    endedAt: string | null,
    findNotSavedAttemptsCount: number,
}

const extractJsonObject = (input: string): string => {
    if (!input) {
        return input;
    }

    const firstBraceIndex = input.indexOf('{');
    if (firstBraceIndex === -1) {
        return input;
    }

    const lastBraceIndex = input.lastIndexOf('}');
    if (lastBraceIndex === -1 || lastBraceIndex < firstBraceIndex) {
        return input;
    }

    return input.substring(firstBraceIndex, lastBraceIndex + 1);
};

/**
 * @summary Extracts a JSON object from the llm response. The response is expected to contain one object.
 * @param input LLM response
 * @returns obj
 * @returns isValid true if JSON.parse was successfully
 */
export const getObjFromLLM = ({
    llmResult,
}: {
    llmResult: any;
}): {
    isValid: boolean;
    obj: Record<string, any>;
} => {
    let isValid = false;
    let jsonObj = {};

    if (llmResult.shouldRetry) {
        return {
            isValid: true,
            obj: llmResult,
        };
    }

    try {
        jsonObj = JSON.parse(extractJsonObject(llmResult));
        isValid = true;
    } catch (e) {}

    return {
        isValid,
        obj: jsonObj,
    };
};
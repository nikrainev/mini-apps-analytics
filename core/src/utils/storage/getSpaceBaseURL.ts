export const getSpaceBaseURL = ({
    bucket,
    endpoint,
}:{
    bucket: string,
    endpoint: string,
}):string => {
    const endpointSplit = endpoint.split('//');
    return `${endpointSplit[0]}//${bucket}.${endpointSplit[1]}`;
};
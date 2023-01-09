export const randomString = (length = 60) => {
    let output = '';

    const characters = 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let index = 0; index < length; index++) {
        output += characters[Math.floor(Math.random() * length)];
    }

    return output;
}
import bcrypt from 'bcrypt';

export const hashString = async (input: string): Promise<string> => {
    return await bcrypt.hash(input, 10);
};
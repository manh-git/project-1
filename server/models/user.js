import mssql from 'mssql';

export const findUserbyEmail = async(email)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request
            .input('email',mssql.VarChar,email)
            .query('select UserID, Email, PasswordHash, UserName from Users where Email= @email');
        return result.recordset[0] || null;
    }
    catch(err){
        console.log("Error-FindUserByEmail:",err);
        throw new Error('Database query failed.');
    }
}
export const createUser = async(userName,email, passwordHash)=> {
    try{
        const request = global.sqlPool.request();
        const result = await request
             .input('userName', mssql.NVarChar, userName)
             .input('email', mssql.VarChar, email)
             .input('passwordHash', mssql.VarChar,passwordHash)
             .input('createAt', mssql.DateTime, new Date())
             .query(`INSERT INTO Users(Email, PasswordHash, UserName, CreatedAt)
                     values(@email, @passwordHash, @userName, @createAt)
                     SELECT SCOPE_IDENTITY() AS UserID;
                `);
            const newUserId = result.recordset[0].UserID;
            const finalResult = await global.sqlPool.request()
                 .input('id', mssql.Int, newUserId)
                 .query('SELECT UserID, Email, UserName FROM Users WHERE UserID = @id');
                return result.recordset[0];
    } catch(err){
        if(err.message.includes('Violation of UNIQUE KEY constraint')){
            throw new Error('The email has already been used.');
        }
        console.error("MSSQL Error - createUser:", err);
        throw new Error('Database insertion failed.');
    }
}
export const updateReset = async(email,token,expires)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request
                       .input('email', mssql.VarChar,email)
                       .input('token',mssql.VarChar,token)
                       .input('expires',mssql.DateTime,expires)
                       .query(`
                             UPDATE Users
                             SET passwordResetToken= @token, passwordResetExpires = @expires
                             WHERE Email=@email
                        `);
        return result.rowsAffected[0];

    }catch(err){
        console.error("Error updating reset token:",err);
        throw new Error("Failed to update reset token in database.");
    }
}
export const updatePassword = async(userId, newHashPassword)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request
                    .input('userId', mssql.Int, userId)
                    .input('newP',mssql.VarChar, newHashPassword)
                    .query(`
                        UPDATE Users
                        SET PasswordHash = @newP, passwordResetToken = Null, passwordResetExpires = NULL
                        WHERE UserID = @userId`
                    )
                    return result.rowsAffected[0];
    }catch(err){
        console.error("Error updating password:", err);
        throw new Error("Failed to update password.");
    }
}
export const findUserByResetToken = async(token)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request
             .input('token', mssql.VarChar,token)
             .query(`
                SELECT UserID, Email, PasswordHash
                FROM Users
                Where passwordResetToken = @token AND passwordResetExpires > GETUTCDATE()`)
        return result.recordset[0]||null;
    } catch(err){{
        console.error("Error finding user by reset token:",err);
        throw new Error("Failed to find user by reset token in database.");
    }}
}
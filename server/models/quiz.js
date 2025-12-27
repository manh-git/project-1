import mssql from 'mssql'

export const saveQuizSummary =async(userId, topicId, totalQuestions)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request 
            .input('userId', mssql.Int, userId)
            .input('topicId', mssql.Int, topicId)
            .input('totalQuestions', mssql.Int, totalQuestions)
            .input('quizDate', mssql.DateTime, new Date())
            .query(`
                INSERT INTO Quizzes (UserID, TopicId, TotalQuestions, QuizDate)
                OUTPUT INSERTED.QuizId
                VALUES (@userId, @topicId, @totalQuestions, @quizDate);
                `)
                return result.recordset[0].QuizId; 
            
            }
    catch(e){
       console.error("error-saveQuizSummary:", e);
        throw new Error("Failed to save quiz summary.");
    }
};

export const saveQuizDetails = async(quizId, details)=>{
    const transaction = new mssql.Transaction(global.sqlPool);
    try{
        await transaction.begin();

        for(const detail of details){
            const request = new mssql.Request(transaction);
            const vocabIdValue = detail.vocabId === null ? null : detail.vocabId;
            const isCorrectValue = (detail.isCorrect === true) ? true : false;
            
            await request
                 .input('quizId', mssql.Int, quizId)
                 .input('vocabId', mssql.Int, vocabIdValue)
                 .input('questionText', mssql.NVarChar, detail.questionText)
                 .input('userAnswer', mssql.NVarChar, detail.userAnswer)
                 .input('isCorrect', mssql.Bit, isCorrectValue)
                 .query(`
                    INSERT INTO QuizDetails (QuizId, VocabId, QuestionText, UserAnswer, IsCorrect)
                    VALUES (@quizId, @vocabId, @questionText, @userAnswer, @isCorrect);`)
        }
      
        await transaction.commit();
          
    } catch(e){
        await transaction.rollback();
        console.error("error-saveQuizDetails:",e);
        throw new Error("Failed to save quiz details.")
    }
}
export const updateQuizSummary = async (quizId, correctAnswers, score, completionTime)=>{
    try{
        const request = global.sqlPool.request();
        const numericalScore = parseInt(score);
        const correctAnswersValue = parseInt(correctAnswers) || 0;
        const completionTimeValue = parseInt(completionTime) || 0;
        
        const result = await request
             .input('quizId',mssql.Int,quizId)
             .input('correctAnswers', mssql.Int, correctAnswersValue)
             .input('score', mssql.Int, numericalScore)
             .input('completionTime', mssql.Int, completionTimeValue)
             .query(`
                UPDATE Quizzes
                SET CorrectAnswers = @correctAnswers, Score = @score, CompletionTime = @completionTime
                WHERE QuizId = @quizId;
                `)
                console.log(`Update Quiz Summary: Affected Rows = ${result.rowsAffected[0]}`);
                
        
    } catch(e){
        console.error("error updateQuiz",e);
        throw new Error("Failed to update quiz summary with results.");
    }
}
export const getTopTenResultsByTopicId = async (topicId) => {
    try {
        const request = global.sqlPool.request();
        const result = await request
            .input('topicId', mssql.Int, topicId)
            .query(`
                SELECT TOP 10
                    Q.Score AS points,
                    Q.CompletionTime AS timeInSeconds,
                    Q.QuizDate AS endTime,
                    U.UserName AS username
                FROM Quizzes Q
                JOIN Users U ON Q.UserID = U.UserID
                WHERE Q.TopicId = @topicId 
                ORDER BY Q.Score DESC, Q.CompletionTime ASC; 
            `);
        
        return result.recordset;

    } catch (err) {
        console.error("error-getTopTenResultsByTopicId:", err);
        throw new Error("Failed to fetch top quiz results.");
    }
}
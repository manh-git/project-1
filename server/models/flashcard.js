import mssql from 'mssql'

export const getVocabsByTopicId = async (topicId)=>{
    try{
        const request = global.sqlPool.request();
        const result = await request
              .input('topicId', mssql.Int, topicId)
              .query(`
                    SELECT VocabId, Word, Pronunciation, Mean_A, ExampleSentence 
                    FROM Vocabulary 
                    WHERE TopicId = @topicId
                `);
            return result.recordset;
    } catch(err){
        console.error("error-getVocabBytopicId:", err);
        throw new Error("Failed to fetch vocabulary for topic.");
    }
};
export const getVocabsByTopicId1 = async (topicId, statusFilter,userId, limit) => {
    
    try{
        const request = global.sqlPool.request();
        let statusCondition = '';
        const normalizedStatus = statusFilter.toLowerCase();
        
        if (normalizedStatus !== 'all') {
            statusCondition = "AND UVS.Status = @statusFilter";
            request.input('statusFilter', mssql.NVarChar, normalizedStatus);
        }
    request.input('topicId', mssql.Int, topicId);
    request.input('userId', mssql.Int, userId);
    request.input('limit', mssql.Int, limit);
        const result = await request
            .query(`
                SELECT TOP (@limit) V.VocabId, V.Word, V.Pronunciation,V. Mean_A, V.ExampleSentence, ISNULL(UVS.Status, 'new') AS Status 
                FROM Vocabulary V
                LEFT JOIN 
                    UserVocabStatus UVS ON V.VocabId = UVS.VocabID AND UVS.UserID = @userId
                WHERE V.TopicId = @topicId
                ${statusCondition}
                ORDER by CASE ISNULL(UVS.Status, 'new')
                        WHEN 'learning' THEN 1
                        WHEN 'new' THEN 2
                        WHEN 'mastered' THEN 3
                        ELSE 4
                    END,
                    V.VocabId
            `);
        
        return result.recordset;

    }catch(err){
        console.error("error-getVocabBytopicId:", err);
        throw new Error("Failed to fetch vocabulary for topic.");
    }
}
export const updateVocabStatus = async (vocabId, userId,newStatus) => {
    try {
        const request = global.sqlPool.request();

        const validStatuses = ['new', 'learning', 'mastered'];
        const normalizedStatus = newStatus.toLowerCase();

        if (!validStatuses.includes(normalizedStatus)) {
            throw new Error(`Invalid status value: ${newStatus}.`);
        }

        request.input('vocabId', mssql.Int, vocabId);
        request.input('userId', mssql.Int, userId);
        request.input('newStatus', mssql.NVarChar, normalizedStatus);

        const result = await request
            .query(`
                MERGE INTO UserVocabStatus AS Target
                USING (VALUES (@vocabId, @userId)) AS Source (VocabID, UserID)
                ON Target.VocabID = Source.VocabID AND Target.UserID = Source.UserID
                WHEN MATCHED THEN
                    UPDATE SET 
                        Status = @newStatus,
                        LastUpdated = GETDATE()
                WHEN NOT MATCHED BY TARGET THEN
                    INSERT (VocabID, UserID, Status, LastUpdated)
                    VALUES (@vocabId, @userId, @newStatus, GETDATE());
            
            `);
        
        return result.rowsAffected[0]; 

    } catch(err) {
        console.error("error-updateVocabStatus:", err);
        throw new Error(`Failed to update status for VocabId ${vocabId}.`);
    }
};


export const getVocabCountByStatus = async (topicId,userId) => {
    try {
        const request = global.sqlPool.request();
        const result = await request
            .input('topicId', mssql.Int, topicId)
            .input('userId', mssql.Int, userId)
            .query(`
                SELECT 
                    ISNULL(UVS.Status, 'new') AS Status, 
                    COUNT(V.VocabId) AS count
                FROM 
                    Vocabulary V
                LEFT JOIN 
                    UserVocabStatus UVS ON V.VocabId = UVS.VocabID AND UVS.UserID = @userId
                WHERE
                    V.TopicId = @topicId 
                GROUP BY 
                    ISNULL(UVS.Status, 'new')
            `);
        return result.recordset; 
    } catch(err) {
        console.error("error-getVocabCountByStatus:", err);
        throw new Error("Failed to fetch vocabulary counts for topic.");
    }
}
export const getTopicByTopicId = async (topicId) => {
    try {
        const request = global.sqlPool.request();
        const result = await request
             .input('topicId', mssql.Int, topicId)
             .query(`Select TopicName from Topics where TopicId = @topicId`);
        return result.recordset[0] ? result.recordset[0].TopicName : null;
        
    } catch(err) {
        console.error(("error - getTopicByTopicId", err));
        throw new Error("Failed to fetch topic name.");
    }
}
import {  getVocabsByTopicId1, getTopicByTopicId, getVocabCountByStatus,updateVocabStatus } from "../models/flashcard.js";
import mssql from 'mssql';

const calculateSuggestedLimits = (availableCount) => {
    if (availableCount <= 0) {
        return [];
    }
    const baseMilestones = [10, 20, 50, 80, 100,120,150,200];
    let suggestedLimits = [];

    if (availableCount < 20) {
        suggestedLimits = [availableCount];
    } else {
        suggestedLimits = baseMilestones.filter(m => m < availableCount);
        
        if (!suggestedLimits.includes(availableCount)) {
            suggestedLimits.push(availableCount);
        }
        
        suggestedLimits = [...new Set(suggestedLimits)].sort((a, b) => a - b);
    }
    
    return suggestedLimits;
};


export const getVocabs = async (req, res)=>{
    const userId = req.validatedUser?.UserID;
    if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized. User ID not found." });
    }
    const { topicId } = req.params; 
    const statusFilter = req.query.status || 'all';
    const limit = parseInt(req.query.limit) || 20; 

    if (!topicId) {
        return res.status(400).json({status: 'error', message: 'Topic ID is required.'});
    }

    if (limit <= 0) {
        return res.status(400).json({status: 'error', message: 'Limit must be a positive number.'});
    }

    try {
        const statusCountsArray = await getVocabCountByStatus(topicId, userId);
        
        let totalCount = 0;
        const statusCounts = statusCountsArray.reduce((acc, current) => {
            const statusKey = current.Status.toLowerCase();
            const count = current.count;
            acc[statusKey] = count;
            totalCount += count;
            return acc;
        }, { new: 0, learning: 0, mastered: 0 });
        statusCounts.all = totalCount;

        const requestedStatus = statusFilter.toLowerCase();
        const availableCount = (requestedStatus === 'all') 
                               ? totalCount 
                               : (statusCounts[requestedStatus] || 0);

        const suggestedLimits = calculateSuggestedLimits(availableCount);
        
        const effectiveLimit = Math.min(limit, availableCount);
        
        let vocabs = [];
        if (effectiveLimit > 0) {
            vocabs = await getVocabsByTopicId1(topicId,  statusFilter,userId, effectiveLimit);
        }
        
        const topicName = await getTopicByTopicId(topicId);

        if (availableCount === 0) {
            return res.status(404).json({
                status: 'error', 
                message: (requestedStatus === 'all') ? 'Topic is empty.' : `No vocabulary found with status '${requestedStatus}' in this topic.`,
                counts: statusCounts,
                suggestedLimits: [],
            });
        }

        res.status(200).json({
            status: 'success',
            topic: topicName || 'Unknown Topic',
            filter: { status: statusFilter, limit: effectiveLimit },
            counts: statusCounts,
            suggestedLimits: suggestedLimits,
            data: vocabs,
        });

    } catch(err) {
        console.error("Error fetching vocabs:", err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching vocab.'
        })
    }
}
export const updateVocabStatusController = async (req, res) => {
    const userId = req.validatedUser?.UserID;
    const { vocabId } = req.params;
    const { status } = req.body;

    if (!userId) { 
        return res.status(401).json({ status: 'error', message: 'Unauthorized. User ID is missing.' });
    }
    if (!vocabId || !status) {
        return res.status(400).json({ status: 'error', message: 'Vocab ID and new status are required.' });
    }

    const validStatuses = ['new', 'learning', 'mastered'];
    if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ status: 'error', message: 'Invalid status value provided.' });
    }

    try {
        const rowsAffected = await updateVocabStatus(parseInt(vocabId), userId, status);
        
        if (rowsAffected > 0) {
            res.status(200).json({ 
                status: 'success', 
                message: `Vocabulary ID ${vocabId} status updated to '${status}'.` 
            });
        } else {
            res.status(404).json({ 
                status: 'error', 
                message: `Vocabulary ID ${vocabId} not found or status already set to '${status}'.` 
            });
        }
    } catch (err) {
        console.error("Error updating vocab status:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

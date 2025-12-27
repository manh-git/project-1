import { getVocabsByTopicId,getTopicByTopicId } from "../models/flashcard.js";
import { saveQuizDetails, updateQuizSummary,saveQuizSummary,getTopTenResultsByTopicId } from "../models/quiz.js";


const TOTAL_QUESTIONS = 10;
const OPTIONS_PER_QUESTION=4;
const MIN_VOCAB_FOR_MATCHING = 2;
//Hàm trộn mảng thuật toán Fisher-Yates: chạy từ cuối đến i=1 trong mỗi lần lặp chọn 1 số ngẫu nhiên j từ 0 đến i rồi hoán đổi vị trí của j với i cho nhau
const shuffleArray = (array)=>{
    for(let i = array.length -1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]= [array[j],array[i]];
    }
    return array;
}
//Hàm chọn ngẫu nhiên n phần tử duy nhất từ 1 mảng 
const getRandomElements = (arr,n)=>{
    if(n>=arr.length) return arr;
    //tạo bản sao và trộn ngẫu nhiên và lấy n phần tử
    const shuffled = [...arr].sort(()=> 0.5 - Math.random());
    return shuffled.slice(0,n);
}

const cleanWord = (word) =>{
    return word ? word.replace(/\s*\([^)]*\)\s*/g,'').trim(): '';
}

const multipleChoice = (correctVocab, allVocab)=>{
    if(!allVocab){
        console.warn("Skipping MCQ: Correct Vocab is empty or invalid.");
        return null;
    }
    const distractorsPool = allVocab.filter(v=> v.VocabId !== correctVocab.VocabId);
    if(distractorsPool.length < OPTIONS_PER_QUESTION - 1){
        console.warn("Skipping MCQ: Not enough valid distractors.");
        return null;
    }
            const randomDistractors = getRandomElements(distractorsPool,OPTIONS_PER_QUESTION-1);
            const options = [
                {
                    optionText: correctVocab.Word,
                    isCorrect: true
                },
                ...randomDistractors.map(d=>({
                    optionText: d.Word,
                    isCorrect: false
                }))
            ];
            const shuffledOptions = shuffleArray(options);
            return{
                VocabId: correctVocab.VocabId,
                type: 'multiple-choice',
                questionText: `Choose the word with the following meaning: "${correctVocab.Mean_A}" `,
                options: shuffledOptions,
                correctAnswer: correctVocab.Word,
            };
}

const fillInTheBlank = (correctVocab)=>{
    const cleanCorrectWord = cleanWord(correctVocab.Word);

    return {
        VocabId: correctVocab.VocabId,
        type: 'fill-in-the-blank',
        questionText: `What is the word that means: "${correctVocab.Mean_A}"`,
        options: null,
        correctAnswer: cleanCorrectWord,
    };
};

const matching = (vocabPair)=>{
    const pairs = vocabPair.map(v=>({
        Word: cleanWord(v.Word),
        Mean_A: v.Mean_A,
        VocabId: v.VocabId
    }));
    if (pairs.length < 2) {
        throw new Error("Matching function requires an array of 2 vocabulary objects.");
    }
    const elements = [
        {id: `W_${pairs[0].VocabId}`,type: 'word',text: pairs[0].Word,matchId: pairs[0].VocabId},
        {id: `M_${pairs[0].VocabId}`,type: 'mean',text: pairs[0].Mean_A,matchId: pairs[0].VocabId},
        {id: `W_${pairs[1].VocabId}`,type: 'word',text: pairs[1].Word,matchId: pairs[1].VocabId},
        {id: `M_${pairs[1].VocabId}`,type: 'mean',text: pairs[1].Mean_A,matchId: pairs[1].VocabId},
    ]
    const correctAnswerArray = [`${pairs[0].VocabId}`,`${pairs[1].VocabId}`];
    const matchingDetails = [
        {word: pairs[0].Word,mean: pairs[0].Mean_A, id: pairs[0].VocabId},
        {word: pairs[1].Word,mean: pairs[1].Mean_A, id: pairs[1].VocabId},

    ]
    return{
        type: 'matching',
        questionText: 'Match the word with its correct meaning.',
        matchingElements: shuffleArray(elements),
        correctAnswer: JSON.stringify(correctAnswerArray.sort()),
        options: null,
        VocabId: null,
        matchingDetails: matchingDetails
    };
}

export const generateQuiz = async(req,res)=>{

    const {topicId,mode} = req.params;
    const userId = req.validatedUser.UserID;
    if(!topicId || !mode){
        return res.status(400).json({status: 'error',message: 'Topic ID is required.'});
    }
    const all_mode = ['multiple-choice', 'fill-in-the-blank', 'matching'];
    const requestedModes = mode.toLowerCase().split(',');
    const selectedModes = requestedModes.filter(m => all_mode.includes(m));

    if (selectedModes.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid or empty quiz mode selected.' });
    }

    try {
        const allVocab = await getVocabsByTopicId(topicId);
        const topicName = await getTopicByTopicId(topicId);
        if(allVocab.length<OPTIONS_PER_QUESTION){
            return res.status(404).json({
                status: 'error',
                message: `At least ${OPTIONS_PER_QUESTION} vocabulary words are needed.`
            })
        }

        const shuffledVocabs = shuffleArray([...allVocab]);
        let questions = [];
        let vocabIndex =0 ;
        
        const totalRemaining = TOTAL_QUESTIONS /*- initialQuestionsCount*/;
        for(let i=0;i<totalRemaining;i++){
            const randomMode = selectedModes[Math.floor(Math.random() * selectedModes.length)];
            const currentVocabIndex = vocabIndex%allVocab.length;

            if(randomMode === 'multiple-choice'){
                const correctVocab = shuffledVocabs[currentVocabIndex];
                questions.push(multipleChoice(correctVocab,allVocab));
                vocabIndex++;
            }else if(randomMode === 'fill-in-the-blank'){
                const correctVocab= shuffledVocabs[currentVocabIndex];
                questions.push(fillInTheBlank(correctVocab));
                vocabIndex++;
            }else if(randomMode === 'matching'){
                const pairStartIndex = vocabIndex%allVocab.length;
                const vocabPair = shuffledVocabs.slice(pairStartIndex,pairStartIndex+MIN_VOCAB_FOR_MATCHING);
                questions.push(matching(vocabPair));
                vocabIndex+=MIN_VOCAB_FOR_MATCHING;
            }
        }
        if(vocabIndex>= allVocab.length){
            vocabIndex=0;
        }
        questions = shuffleArray(questions);

        if(!userId){
            return res.status(401).json({ status: 'error', message: 'User not authenticated to generate quiz.' });
        
        }
        console.log(`Attempting to save quiz summary: UserID=${userId}, TopicID=${topicId}, TotalQuestions=${TOTAL_QUESTIONS}`);
        const newQuizId = await saveQuizSummary(userId, topicId, questions.length);
        res.status(200).json({
            status: 'success',
            topic: topicName || 'Unknown Topic',
            quizId: newQuizId,
            questions: questions,
            totalQuestions: questions.length
        })
    }
    catch (e){
        console.error("Error generating quiz:",e);
        res.status(500).json({
            status:'error',
            message: 'Internal server error while generating the quiz.'

        });
    }
}

export const submitQuiz = async(req,res)=>{
    const{
        quizId,
        summary: {score, correct, total},
        completionTimeSeconds,
        details
    } = req.body;
    if(!quizId||!details||details.length===0){
        return res.status(400).json({status:'error',message:'Invalid data!'});

    }
    try{
        await saveQuizDetails(quizId,details);
        await updateQuizSummary(quizId, correct,score, completionTimeSeconds);

        res.status(200).json({
            status:'success',
            message: 'Save successfull',
            quizId: quizId,
            score: score
        });
    }catch(e){
        console.error("Error submit quiz:",e);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while submitting the quiz.'
        })
    }
}
export const getRanking = async(req, res) =>{
    const { topicId } = req.params;

    if (!topicId) {
        return res.status(400).json({ status: 'error', message: 'Topic ID is required for ranking.' });
    }

    try {
        const ranking = await getTopTenResultsByTopicId(topicId);
        const formattedRanking = (ranking??[]).map((result, index) => {
            const date = new Date(result.endTime);
            const hours = Math.floor(result.timeInSeconds / 3600);
            const minutes = Math.floor((result.timeInSeconds % 3600) / 60);
            const seconds = result.timeInSeconds % 60;
            const pad = (num) => num.toString().padStart(2, '0');
            const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
            return {
                rank: index + 1,
                username: result.username,
                points: parseFloat(result.points).toFixed(2),
                time: formattedTime,
                endTime: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' ' + date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                rawTime: result.timeInSeconds,};
        });
        res.status(200).json({
            status: 'success',
            ranking: formattedRanking
        });
    } catch(e){
        console.error("Error fetching ranking:", e);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching ranking.'
        });

    }

}

use Review_Vocab;
go

Create table Users(
UserID int IDENTITY(1,1) primary key,
Email varchar(100) unique,
PasswordHash varchar(100),
UserName Nvarchar(100),
CreatedAt datetime

);

Create table Topics(
TopicId int primary key ,
TopicName varchar(100) unique,
);

Create table Vocabulary(
VocabId int primary key identity(1,1),
TopicId int not null,
Word varchar(150),
Pronunciation varchar(100),
Mean_A varchar(max),
Mean_B Nvarchar(max),
ExampleSentence varchar(Max),
foreign key (TopicId) references Topics(TopicId)

);
create table Quizzes(
QuizId INT IDENTITY(1,1) PRIMARY KEY, 
    UserId INT NOT NULL,
    TopicId INT NOT NULL,
    FOREIGN KEY(UserID) REFERENCES Users(UserID),
    FOREIGN KEY (TopicId) REFERENCES Topics(TopicId),
    TotalQuestions INT,
    CorrectAnswers INT,
    Score DECIMAL(5,2),
    CompletionTime INT,
    QuizDate DATETIME
);
CREATE TABLE UserProgress(
    UserId INT NOT NULL,
    VocabId INT NOT NULL, 
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VocabId) REFERENCES Vocabulary(VocabId),
    PRIMARY KEY (UserId, VocabId), 
    ReviewCount INT DEFAULT 0,
    LastReview DATETIME,
    SuccessRate DECIMAL(5,2)
);
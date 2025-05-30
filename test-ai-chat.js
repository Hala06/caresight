// test-ai-chat.js - Simple test script for AI chat functionality
const testQuestions = [
  {
    question: "What is hypertension?",
    expectedKeywords: ["blood pressure", "high", "heart", "arteries"]
  },
  {
    question: "What does positive nodes mean?",
    expectedKeywords: ["lymph", "cancer", "metastasis", "spread"]
  },
  {
    question: "What are the symptoms of diabetes?",
    expectedKeywords: ["blood sugar", "glucose", "thirst", "urination"]
  },
  {
    question: "Should I take medication X for my condition?",
    expectedKeywords: ["healthcare provider", "doctor", "professional", "consult"]
  }
];

async function testAIChat() {
  console.log("🧪 Testing CareSight AI Chat Functionality\n");
  
  for (let i = 0; i < testQuestions.length; i++) {
    const test = testQuestions[i];
    console.log(`Test ${i + 1}: ${test.question}`);
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: test.question })
      });
      
      if (!response.ok) {
        console.log(`❌ Failed with status: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const answer = data.response.toLowerCase();
      
      console.log(`📝 Response: ${data.response.substring(0, 100)}...`);
      
      // Check if response contains expected keywords
      const foundKeywords = test.expectedKeywords.filter(keyword => 
        answer.includes(keyword.toLowerCase())
      );
      
      if (foundKeywords.length > 0) {
        console.log(`✅ Found relevant keywords: ${foundKeywords.join(', ')}`);
      } else {
        console.log(`⚠️  No expected keywords found`);
      }
      
      console.log("---\n");
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

// Run the test
testAIChat();

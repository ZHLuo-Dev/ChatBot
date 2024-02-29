const questionsData = {
    categories: {
      'Panels': {
        questions: ['Left Panel serves what purpose?', 'Right Panel serves what purpose?', 'Middle Panel serves what purpose?'],
        answers: {
          'Left Panel serves what purpose?': 'The left panel represents the Monthly Summary regarding the completion of work tasks. The standard completion quantity is 300. If your completed tasks exceed 300 by the end of the month, you will receive a bonus reward based on the surplus completed. Conversely, failing to meet the quota will result in fines deducted proportionately.',
          'Right Panel serves what purpose?': 'The right panel represents various attributes of the character: from top to bottom, the first represents coins, with an initial capital of 100 coins. The second gear pattern represents work productivity, indicating the amount of tasks a player can complete in a workday (with room for improvement). The third represents mood value, which decreases during work and affects other aspects as well. The fourth represents energy, indicating stamina (with room for improvement in energy cap as well, so keep exploring).',
          'Middle Panel serves what purpose?': 'The topmost section represents the current time in the format of which week\'s day it is. The left side contains titles denoting different date types. The middle panel covers the current day\'s situation and options. The bottom panel represents the player\'s status (Pay attention to that).',
        }
      },
      'Tips': {
        questions: ['Regarding the option to skip work', 'Regarding the option to have fun', 'Regarding overtime','Regarding the option to exercise', 'Regarding the option of Lazy Day', 'Regarding the option of Learning'],
        answers: {
          'Regarding the option to skip work': 'You have two chances to skip work without consequences; exceed this, and it\'s game over. Going to work will slightly affect your mood and energy but will also grant your standard day\'s  wages after day ends.',
          'Regarding the option to have fun': 'This will significantly boost your mood but will slightly decrease your energy and cost you a fee.',
          'Regarding overtime': '^^ It\'s your chance to double down on effort ',
          'Regarding the option to exercise': 'It\'ll slightly improve your mood, consume some energy, and then... let\'s just say there are certain benefits we can\'t openly discuss here.',
          'Regarding the option of Lazy Day': 'As the name suggests, take it easy. But beware, your productivity at work might take a hit.',
          'Regarding the option of Learning': 'Can\'t reveal too much here, but let\'s just say it\'s a pivotal choice. And keep an eye on your status panel at all times.',
        }
      },
      'Others': {
        questions: ['What are the future update plans?', 'About some special symbols.', 'What is the original intention of this game?'],
        answers: {
          'What are the future update plans?': 'When time allows, I will try to supplement with a user login system for you to better manage everyone\'s game records in "2023 Decision" and will include features such as viewing the site-wide leaderboard, gold records, etc. If there\'s more time in the future, I will continue to modify and improve the game mechanics and enrich the gameplay.',
          'About some special symbols.': 'You can see icons with question marks on the page; simply hover your mouse over them for a moment to display related information. More complete explanations are available on this chatbot page for browsing. Additionally, you might notice changes in the icons for mood and energy - be cautious, as they can lead to unexpected or negative effects in the game.',
          'What is the original intention of this game?': 'I believe it\'s meaningless to spend time on develop something that doesn\'t reflect your own ideas. This simple interactive choice-based game aims to simulate the effects of various choices in life as much as possible, while also wanting to convey multiple themes. Firstly, it\'s about expressing the pros and cons of different choices a person makes in life. Some benefits provide short-term returns, while others are long-term. Similarly, the downsides. Sometimes you\'ll find it crucial how to make good decisions in life, especially when real life is much more complicated. Hence, it\'s important whether you can strategize well for your goals. At the same time, this game also offers an "unexpected" ending. If you reach this point, you will discover a new theme. Another original intention is to exercise my coding ^ ^. GLHF.',
        }
      },
    }
  };
  
  export default questionsData;
  
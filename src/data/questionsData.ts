import { QuestionTemplate } from '../types';

const avocationQuestions = [
  {
    id: 'AvocationSelection',
    text: 'Please select all avocation activities you participate in',
    sectionName: 'Primary Selection',
    type: 'checkbox',
    options: [
      'Motor Racing',
      'Underwater Activities',
      'Skydiving/Parachuting',
      'Helicopter Skiing',
      'Gambling',
      'Hunting',
      'Cycling',
      'Mountain Climbing/Mountaineering',
      'Rock Climbing',
      'Bungee Jumping',
      'Combat Sports',
      'Extreme Sports',
      'Aviation/Piloting',
      'Off-road Driving',
      'White Water Rafting/Kayaking',
      'Paragliding/Hang Gliding',
      'None of the above'
    ]
  },
  // Motor Racing Questions
  {
    id: 'MotorRacingProficiency',
    text: 'What is your proficiency level in Motor Racing?',
    sectionName: 'Motor Racing',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'MotorRacing',
      value: true
    }
  },
  {
    id: 'MotorRacingContests',
    text: 'Do you engage in professional racing contests?',
    sectionName: 'Motor Racing',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'MotorRacingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'MotorRacingEvents',
    text: 'Which motor racing events do you participate in? (Select all that apply)',
    sectionName: 'Motor Racing',
    type: 'checkbox',
    options: ['Formula 1', 'Formula 2', 'GT Racing', 'Rally', 'Drag Racing', 'Karting', 'Other'],
    condition: {
      questionId: 'MotorRacingContests',
      value: 'Yes'
    }
  },
  {
    id: 'MotorRacingTeamSize',
    text: 'What is the size of your racing team?',
    sectionName: 'Motor Racing',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'MotorRacingContests',
      value: 'Yes'
    }
  },
  {
    id: 'MotorRacingLastDate',
    text: 'When did you last participate in a motor racing event?',
    sectionName: 'Motor Racing',
    type: 'date',
    condition: {
      questionId: 'MotorRacingContests',
      value: 'Yes'
    }
  },
  // Underwater Activities Questions
  {
    id: 'UnderwaterProficiency',
    text: 'What is your proficiency level in Underwater Activities?',
    sectionName: 'Underwater Activities',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'UnderwaterActivities',
      value: true
    }
  },
  {
    id: 'UnderwaterContests',
    text: 'Do you engage in professional diving competitions?',
    sectionName: 'Underwater Activities',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'UnderwaterProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'UnderwaterTypes',
    text: 'Which underwater activities do you participate in? (Select all that apply)',
    sectionName: 'Underwater Activities',
    type: 'checkbox',
    options: ['Scuba Diving', 'Freediving', 'Ice Diving', 'Cave Diving', 'Underwater Photography', 'Other'],
    condition: {
      questionId: 'UnderwaterContests',
      value: 'Yes'
    }
  },
  {
    id: 'UnderwaterTeamSize',
    text: 'What is the size of your diving team?',
    sectionName: 'Underwater Activities',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'UnderwaterContests',
      value: 'Yes'
    }
  },
  {
    id: 'UnderwaterLastDate',
    text: 'When did you last participate in an underwater activity event?',
    sectionName: 'Underwater Activities',
    type: 'date',
    condition: {
      questionId: 'UnderwaterContests',
      value: 'Yes'
    }
  },
  // Activity Timeframe Questions
  {
    id: 'MotorRacing',
    text: 'Motor Racing',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'AvocationSelection',
      value: ['Motor Racing']
    }
  },
  {
    id: 'MotorRacing3Months',
    text: 'Last 3 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'MotorRacing',
      value: true
    }
  },
  {
    id: 'MotorRacing6Months',
    text: 'Last 6 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'MotorRacing',
      value: true
    }
  },
  {
    id: 'MotorRacing9Months',
    text: 'Last 9 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'MotorRacing',
      value: true
    }
  },
  {
    id: 'MotorRacing12Months',
    text: 'Last 12 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'MotorRacing',
      value: true
    }
  },
  {
    id: 'UnderwaterActivities',
    text: 'Underwater Activities',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'AvocationSelection',
      value: ['Underwater Activities']
    }
  },
  {
    id: 'UnderwaterActivities3Months',
    text: 'Last 3 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'UnderwaterActivities',
      value: true
    }
  },
  {
    id: 'UnderwaterActivities6Months',
    text: 'Last 6 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'UnderwaterActivities',
      value: true
    }
  },
  {
    id: 'UnderwaterActivities9Months',
    text: 'Last 9 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'UnderwaterActivities',
      value: true
    }
  },
  {
    id: 'UnderwaterActivities12Months',
    text: 'Last 12 months',
    sectionName: 'Activity Timeframe',
    type: 'checkbox',
    condition: {
      questionId: 'UnderwaterActivities',
      value: true
    }
  },
  // Skydiving Questions
  {
    id: 'SkydivingProficiency',
    text: 'What is your proficiency level in Skydiving/Parachuting?',
    sectionName: 'Skydiving',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Skydiving',
      value: true
    }
  },
  {
    id: 'SkydivingContests',
    text: 'Do you engage in professional skydiving competitions?',
    sectionName: 'Skydiving',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'SkydivingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'SkydivingTypes',
    text: 'Which skydiving disciplines do you participate in? (Select all that apply)',
    sectionName: 'Skydiving',
    type: 'checkbox',
    options: ['Formation Skydiving', 'Freeflying', 'Canopy Piloting', 'Wingsuit Flying', 'BASE Jumping', 'Other'],
    condition: {
      questionId: 'SkydivingContests',
      value: 'Yes'
    }
  },
  {
    id: 'SkydivingTeamSize',
    text: 'What is the size of your skydiving team?',
    sectionName: 'Skydiving',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'SkydivingContests',
      value: 'Yes'
    }
  },
  {
    id: 'SkydivingLastDate',
    text: 'When did you last participate in a skydiving event?',
    sectionName: 'Skydiving',
    type: 'date',
    condition: {
      questionId: 'SkydivingContests',
      value: 'Yes'
    }
  },
  // Helicopter Skiing Questions
  {
    id: 'HelicopterSkiingProficiency',
    text: 'What is your proficiency level in Helicopter Skiing?',
    sectionName: 'Helicopter Skiing',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'HelicopterSkiing',
      value: true
    }
  },
  {
    id: 'HelicopterSkiingContests',
    text: 'Do you engage in professional heli-skiing competitions?',
    sectionName: 'Helicopter Skiing',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'HelicopterSkiingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'HelicopterSkiingTypes',
    text: 'Which heli-skiing activities do you participate in? (Select all that apply)',
    sectionName: 'Helicopter Skiing',
    type: 'checkbox',
    options: ['Extreme Backcountry', 'Freestyle', 'Film Production', 'Guided Tours', 'Other'],
    condition: {
      questionId: 'HelicopterSkiingContests',
      value: 'Yes'
    }
  },
  {
    id: 'HelicopterSkiingTeamSize',
    text: 'What is the size of your skiing team?',
    sectionName: 'Helicopter Skiing',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'HelicopterSkiingContests',
      value: 'Yes'
    }
  },
  {
    id: 'HelicopterSkiingLastDate',
    text: 'When did you last participate in a heli-skiing event?',
    sectionName: 'Helicopter Skiing',
    type: 'date',
    condition: {
      questionId: 'HelicopterSkiingContests',
      value: 'Yes'
    }
  },
  // Gambling Questions
  {
    id: 'GamblingProficiency',
    text: 'What is your proficiency level in Gambling?',
    sectionName: 'Gambling',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Gambling',
      value: true
    }
  },
  {
    id: 'GamblingContests',
    text: 'Do you engage in professional gambling tournaments?',
    sectionName: 'Gambling',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'GamblingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'GamblingTypes',
    text: 'Which gambling activities do you participate in? (Select all that apply)',
    sectionName: 'Gambling',
    type: 'checkbox',
    options: ['Poker', 'Blackjack', 'Sports Betting', 'Casino Games', 'Horse Racing', 'Other'],
    condition: {
      questionId: 'GamblingContests',
      value: 'Yes'
    }
  },
  {
    id: 'GamblingLastDate',
    text: 'When did you last participate in a gambling tournament?',
    sectionName: 'Gambling',
    type: 'date',
    condition: {
      questionId: 'GamblingContests',
      value: 'Yes'
    }
  },
  // Hunting Questions
  {
    id: 'HuntingProficiency',
    text: 'What is your proficiency level in Hunting?',
    sectionName: 'Hunting',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Hunting',
      value: true
    }
  },
  {
    id: 'HuntingContests',
    text: 'Do you engage in professional hunting competitions?',
    sectionName: 'Hunting',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'HuntingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'HuntingTypes',
    text: 'Which hunting activities do you participate in? (Select all that apply)',
    sectionName: 'Hunting',
    type: 'checkbox',
    options: ['Big Game', 'Bow Hunting', 'Bird Hunting', 'Safari', 'Predator Hunting', 'Other'],
    condition: {
      questionId: 'HuntingContests',
      value: 'Yes'
    }
  },
  {
    id: 'HuntingTeamSize',
    text: 'What is the size of your hunting group?',
    sectionName: 'Hunting',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'HuntingContests',
      value: 'Yes'
    }
  },
  {
    id: 'HuntingLastDate',
    text: 'When did you last participate in a hunting event?',
    sectionName: 'Hunting',
    type: 'date',
    condition: {
      questionId: 'HuntingContests',
      value: 'Yes'
    }
  },
  // Cycling Questions
  {
    id: 'CyclingProficiency',
    text: 'What is your proficiency level in Cycling?',
    sectionName: 'Cycling',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Cycling',
      value: true
    }
  },
  {
    id: 'CyclingContests',
    text: 'Do you engage in professional cycling competitions?',
    sectionName: 'Cycling',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'CyclingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'CyclingTypes',
    text: 'Which cycling disciplines do you participate in? (Select all that apply)',
    sectionName: 'Cycling',
    type: 'checkbox',
    options: ['Road Racing', 'Mountain Biking', 'BMX', 'Track Cycling', 'Cyclocross', 'Other'],
    condition: {
      questionId: 'CyclingContests',
      value: 'Yes'
    }
  },
  {
    id: 'CyclingTeamSize',
    text: 'What is the size of your cycling team?',
    sectionName: 'Cycling',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'CyclingContests',
      value: 'Yes'
    }
  },
  {
    id: 'CyclingLastDate',
    text: 'When did you last participate in a cycling event?',
    sectionName: 'Cycling',
    type: 'date',
    condition: {
      questionId: 'CyclingContests',
      value: 'Yes'
    }
  },
  // Mountaineering Questions
  {
    id: 'MountaineeringProficiency',
    text: 'What is your proficiency level in Mountain Climbing/Mountaineering?',
    sectionName: 'Mountaineering',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Mountaineering',
      value: true
    }
  },
  {
    id: 'MountaineeringContests',
    text: 'Do you engage in professional mountaineering expeditions?',
    sectionName: 'Mountaineering',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'MountaineeringProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'MountaineeringTypes',
    text: 'Which mountaineering activities do you participate in? (Select all that apply)',
    sectionName: 'Mountaineering',
    type: 'checkbox',
    options: ['Alpine Climbing', 'Himalayan Expeditions', 'Ice Climbing', 'High Altitude', 'Guided Tours', 'Other'],
    condition: {
      questionId: 'MountaineeringContests',
      value: 'Yes'
    }
  },
  {
    id: 'MountaineeringTeamSize',
    text: 'What is the size of your mountaineering team?',
    sectionName: 'Mountaineering',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'MountaineeringContests',
      value: 'Yes'
    }
  },
  {
    id: 'MountaineeringLastDate',
    text: 'When did you last participate in a mountaineering expedition?',
    sectionName: 'Mountaineering',
    type: 'date',
    condition: {
      questionId: 'MountaineeringContests',
      value: 'Yes'
    }
  },
  // Rock Climbing Questions
  {
    id: 'RockClimbingProficiency',
    text: 'What is your proficiency level in Rock Climbing?',
    sectionName: 'Rock Climbing',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'RockClimbing',
      value: true
    }
  },
  {
    id: 'RockClimbingContests',
    text: 'Do you engage in professional rock climbing competitions?',
    sectionName: 'Rock Climbing',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'RockClimbingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'RockClimbingTypes',
    text: 'Which rock climbing disciplines do you participate in? (Select all that apply)',
    sectionName: 'Rock Climbing',
    type: 'checkbox',
    options: ['Bouldering', 'Sport Climbing', 'Traditional Climbing', 'Free Solo', 'Speed Climbing', 'Other'],
    condition: {
      questionId: 'RockClimbingContests',
      value: 'Yes'
    }
  },
  {
    id: 'RockClimbingTeamSize',
    text: 'What is the size of your climbing team?',
    sectionName: 'Rock Climbing',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'RockClimbingContests',
      value: 'Yes'
    }
  },
  {
    id: 'RockClimbingLastDate',
    text: 'When did you last participate in a rock climbing event?',
    sectionName: 'Rock Climbing',
    type: 'date',
    condition: {
      questionId: 'RockClimbingContests',
      value: 'Yes'
    }
  },
  // Bungee Jumping Questions
  {
    id: 'BungeeJumpingProficiency',
    text: 'What is your proficiency level in Bungee Jumping?',
    sectionName: 'Bungee Jumping',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'BungeeJumping',
      value: true
    }
  },
  {
    id: 'BungeeJumpingContests',
    text: 'Do you engage in professional bungee jumping exhibitions?',
    sectionName: 'Bungee Jumping',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'BungeeJumpingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'BungeeJumpingTypes',
    text: 'Which bungee jumping activities do you participate in? (Select all that apply)',
    sectionName: 'Bungee Jumping',
    type: 'checkbox',
    options: ['Classic Jumps', 'Tandem Jumps', 'Water Touch', 'Night Jumps', 'Extreme Height', 'Other'],
    condition: {
      questionId: 'BungeeJumpingContests',
      value: 'Yes'
    }
  },
  {
    id: 'BungeeJumpingLastDate',
    text: 'When did you last participate in a bungee jumping event?',
    sectionName: 'Bungee Jumping',
    type: 'date',
    condition: {
      questionId: 'BungeeJumpingContests',
      value: 'Yes'
    }
  },
  // Combat Sports Questions
  {
    id: 'CombatSportsProficiency',
    text: 'What is your proficiency level in Combat Sports?',
    sectionName: 'Combat Sports',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'CombatSports',
      value: true
    }
  },
  {
    id: 'CombatSportsContests',
    text: 'Do you engage in professional combat sports competitions?',
    sectionName: 'Combat Sports',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'CombatSportsProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'CombatSportsTypes',
    text: 'Which combat sports do you participate in? (Select all that apply)',
    sectionName: 'Combat Sports',
    type: 'checkbox',
    options: ['Boxing', 'MMA', 'Jiu-Jitsu', 'Muay Thai', 'Wrestling', 'Karate', 'Other'],
    condition: {
      questionId: 'CombatSportsContests',
      value: 'Yes'
    }
  },
  {
    id: 'CombatSportsTeamSize',
    text: 'What is the size of your training team?',
    sectionName: 'Combat Sports',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'CombatSportsContests',
      value: 'Yes'
    }
  },
  {
    id: 'CombatSportsLastDate',
    text: 'When did you last participate in a combat sports event?',
    sectionName: 'Combat Sports',
    type: 'date',
    condition: {
      questionId: 'CombatSportsContests',
      value: 'Yes'
    }
  },
  // Extreme Sports Questions
  {
    id: 'ExtremeSportsProficiency',
    text: 'What is your proficiency level in Extreme Sports?',
    sectionName: 'Extreme Sports',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'ExtremeSports',
      value: true
    }
  },
  {
    id: 'ExtremeSportsContests',
    text: 'Do you engage in professional extreme sports competitions?',
    sectionName: 'Extreme Sports',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'ExtremeSportsProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'ExtremeSportsTypes',
    text: 'Which extreme sports do you participate in? (Select all that apply)',
    sectionName: 'Extreme Sports',
    type: 'checkbox',
    options: ['Skateboarding', 'BMX', 'Snowboarding', 'Motocross', 'Parkour', 'Other'],
    condition: {
      questionId: 'ExtremeSportsContests',
      value: 'Yes'
    }
  },
  {
    id: 'ExtremeSportsTeamSize',
    text: 'What is the size of your team?',
    sectionName: 'Extreme Sports',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'ExtremeSportsContests',
      value: 'Yes'
    }
  },
  {
    id: 'ExtremeSportsLastDate',
    text: 'When did you last participate in an extreme sports event?',
    sectionName: 'Extreme Sports',
    type: 'date',
    condition: {
      questionId: 'ExtremeSportsContests',
      value: 'Yes'
    }
  },
  // Aviation Questions
  {
    id: 'AviationProficiency',
    text: 'What is your proficiency level in Aviation/Piloting?',
    sectionName: 'Aviation',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Aviation',
      value: true
    }
  },
  {
    id: 'AviationContests',
    text: 'Do you engage in professional aviation competitions?',
    sectionName: 'Aviation',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'AviationProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'AviationTypes',
    text: 'Which aviation activities do you participate in? (Select all that apply)',
    sectionName: 'Aviation',
    type: 'checkbox',
    options: ['Aerobatics', 'Air Racing', 'Bush Flying', 'Stunt Flying', 'Test Piloting', 'Other'],
    condition: {
      questionId: 'AviationContests',
      value: 'Yes'
    }
  },
  {
    id: 'AviationTeamSize',
    text: 'What is the size of your aviation team?',
    sectionName: 'Aviation',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'AviationContests',
      value: 'Yes'
    }
  },
  {
    id: 'AviationLastDate',
    text: 'When did you last participate in an aviation event?',
    sectionName: 'Aviation',
    type: 'date',
    condition: {
      questionId: 'AviationContests',
      value: 'Yes'
    }
  },
  // Off-road Driving Questions
  {
    id: 'OffRoadDrivingProficiency',
    text: 'What is your proficiency level in Off-road Driving?',
    sectionName: 'Off-road Driving',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'OffRoadDriving',
      value: true
    }
  },
  {
    id: 'OffRoadDrivingContests',
    text: 'Do you engage in professional off-road competitions?',
    sectionName: 'Off-road Driving',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'OffRoadDrivingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'OffRoadDrivingTypes',
    text: 'Which off-road activities do you participate in? (Select all that apply)',
    sectionName: 'Off-road Driving',
    type: 'checkbox',
    options: ['Rally Raid', 'Baja Racing', 'Rock Crawling', 'Trophy Truck', 'Mud Bogging', 'Other'],
    condition: {
      questionId: 'OffRoadDrivingContests',
      value: 'Yes'
    }
  },
  {
    id: 'OffRoadDrivingTeamSize',
    text: 'What is the size of your off-road team?',
    sectionName: 'Off-road Driving',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'OffRoadDrivingContests',
      value: 'Yes'
    }
  },
  {
    id: 'OffRoadDrivingLastDate',
    text:  'When did you last participate in an off-road event?',
    sectionName: 'Off-road Driving',
    type: 'date',
    condition: {
      questionId: 'OffRoadDrivingContests',
      value: 'Yes'
    }
  },
  // Rafting Questions
  {
    id: 'RaftingProficiency',
    text: 'What is your proficiency level in White Water Rafting/Kayaking?',
    sectionName: 'Rafting',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Rafting',
      value: true
    }
  },
  {
    id: 'RaftingContests',
    text: 'Do you engage in professional rafting/kayaking competitions?',
    sectionName: 'Rafting',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'RaftingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'RaftingTypes',
    text: 'Which rafting/kayaking activities do you participate in? (Select all that apply)',
    sectionName: 'Rafting',
    type: 'checkbox',
    options: ['Slalom', 'Extreme Racing', 'Expedition', 'Freestyle', 'River Running', 'Other'],
    condition: {
      questionId: 'RaftingContests',
      value: 'Yes'
    }
  },
  {
    id: 'RaftingTeamSize',
    text: 'What is the size of your rafting team?',
    sectionName: 'Rafting',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'RaftingContests',
      value: 'Yes'
    }
  },
  {
    id: 'RaftingLastDate',
    text: 'When did you last participate in a rafting/kayaking event?',
    sectionName: 'Rafting',
    type: 'date',
    condition: {
      questionId: 'RaftingContests',
      value: 'Yes'
    }
  },
  // Paragliding Questions
  {
    id: 'ParaglidingProficiency',
    text: 'What is your proficiency level in Paragliding/Hang Gliding?',
    sectionName: 'Paragliding',
    type: 'radio',
    options: ['Beginner', 'Almost There', 'True Professional'],
    condition: {
      questionId: 'Paragliding',
      value: true
    }
  },
  {
    id: 'ParaglidingContests',
    text: 'Do you engage in professional paragliding/hang gliding competitions?',
    sectionName: 'Paragliding',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'ParaglidingProficiency',
      value: 'True Professional'
    }
  },
  {
    id: 'ParaglidingTypes',
    text: 'Which paragliding/hang gliding activities do you participate in? (Select all that apply)',
    sectionName: 'Paragliding',
    type: 'checkbox',
    options: ['Cross Country', 'Aerobatics', 'Powered Paragliding', 'Distance Flying', 'Speed Flying', 'Other'],
    condition: {
      questionId: 'ParaglidingContests',
      value: 'Yes'
    }
  },
  {
    id: 'ParaglidingTeamSize',
    text: 'What is the size of your flying team?',
    sectionName: 'Paragliding',
    type: 'numeric',
    min: 1,
    max: 6,
    condition: {
      questionId: 'ParaglidingContests',
      value: 'Yes'
    }
  },
  {
    id: 'ParaglidingLastDate',
    text: 'When did you last participate in a paragliding/hang gliding event?',
    sectionName: 'Paragliding',
    type: 'date',
    condition: {
      questionId: 'ParaglidingContests',
      value: 'Yes'
    }
  }
];

const sleepAssessmentQuestions = [
  {
    id: 'SleepDuration',
    text: 'How many hours do you typically sleep per night?',
    sectionName: 'Sleep Duration',
    type: 'checkbox',
    options: ['1 hour', '2 hours', '3 hours', '4 hours', '5 hours']
  },
  {
    id: 'PrescribedMeds',
    text: 'Are you prescribed any sleep medications?',
    sectionName: 'Sleep Medication',
    type: 'radio',
    options: ['Yes', 'No', "Don't Know"],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'MedicationName',
    text: 'Add Medication',
    sectionName: 'Sleep Medication',
    type: 'medication',
    condition: {
      questionId: 'PrescribedMeds',
      value: 'Yes'
    }
  },
  {
    id: 'SleepQuality',
    text: 'How would you rate your overall sleep quality?',
    sectionName: 'Sleep Quality',
    type: 'radio',
    options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
  },
  {
    id: 'Insomnia',
    text: 'Do you experience insomnia?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'InsomniaType',
    text: 'What type of insomnia do you experience?',
    sectionName: 'Sleep Disorders',
    type: 'checkbox',
    options: [
      'Difficulty falling asleep',
      'Difficulty staying asleep',
      'Waking up too early',
      'Non-restorative sleep'
    ],
    condition: {
      questionId: 'Insomnia',
      value: ['Yes', 'Sometimes']
    }
  },
  {
    id: 'DaytimeSleepiness',
    text: 'Do you experience excessive daytime sleepiness?',
    sectionName: 'Daytime Function',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'SleepinessSeverity',
    text: 'How would you rate the severity of your daytime sleepiness?',
    sectionName: 'Daytime Function',
    type: 'radio',
    options: ['Mild', 'Moderate', 'Severe', 'Extreme'],
    condition: {
      questionId: 'DaytimeSleepiness',
      value: ['Yes', 'Sometimes']
    }
  },
  {
    id: 'MedicalConditions',
    text: 'Do you have any of the following medical conditions?',
    sectionName: 'Medical History',
    type: 'checkbox',
    options: [
      'Anxiety',
      'Depression',
      'Chronic pain',
      'Sleep apnea',
      'Restless leg syndrome',
      'Heartburn/GERD',
      'Thyroid disorder',
      'Chronic fatigue syndrome',
      'Fibromyalgia',
      'None of the above'
    ],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'BreathingPauses',
    text: 'Has anyone observed you having pauses in breathing during sleep?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', "Don't Know"],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'MorningHeadaches',
    text: 'Do you experience morning headaches?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'Nightmares',
    text: 'Do you experience nightmares?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'StayAwakeReason',
    text: 'What are the main reasons you stay awake at night?',
    sectionName: 'Sleep Habits',
    type: 'checkbox',
    options: [
      'Racing thoughts',
      'Anxiety',
      'Physical discomfort/pain',
      'Noise/light disturbances',
      'Temperature issues',
      'Partner snoring/movement',
      'Electronics use',
      'Caffeine consumption',
      'Work/study',
      'Other'
    ],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  },
  {
    id: 'Snoring',
    text: 'Do you snore?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', "Don't Know"],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours', '4 hours']
    }
  },
  {
    id: 'SleepEnvironment',
    text: 'What describes your sleep environment?',
    sectionName: 'Sleep Environment',
    type: 'checkbox',
    options: [
      'Dark room',
      'Light enters the room',
      'Quiet',
      'Noisy',
      'Too hot',
      'Too cold',
      'Comfortable bed',
      'Uncomfortable bed',
      'Sleep with TV on',
      'Sleep with music',
      'Sleep with white noise'
    ],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours', '4 hours']
    }
  },
  {
    id: 'CaffeineConsumption',
    text: 'Do you consume caffeine in the afternoon or evening?',
    sectionName: 'Sleep Habits',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours', '4 hours']
    }
  },
  {
    id: 'AlcoholConsumption',
    text: 'Do you consume alcohol within 4 hours of bedtime?',
    sectionName: 'Sleep Habits',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours', '4 hours']
    }
  },
  {
    id: 'BedTime',
    text: 'What time do you typically go to bed?',
    sectionName: 'Sleep Schedule',
    type: 'time'
  },
  {
    id: 'WakeTime',
    text: 'What time do you typically wake up?',
    sectionName: 'Sleep Schedule',
    type: 'time'
  },
  {
    id: 'MorningFeeling',
    text: 'How do you typically feel when you wake up?',
    sectionName: 'Sleep Quality',
    type: 'radio',
    options: ['Refreshed', 'Still tired', 'Exhausted', 'Variable']
  },
  {
    id: 'ElectronicDevices',
    text: 'Do you use electronic devices (phone, tablet, TV) within an hour of bedtime?',
    sectionName: 'Sleep Habits',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes']
  },
  {
    id: 'ExerciseFrequency',
    text: 'How often do you exercise?',
    sectionName: 'Lifestyle',
    type: 'radio',
    options: ['Never', '1-2 times per week', '3-4 times per week', '5+ times per week']
  },
  {
    id: 'FallingBackAsleep',
    text: 'Do you have trouble falling back asleep if you wake up during the night?',
    sectionName: 'Sleep Disorders',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
    condition: {
      questionId: 'SleepDuration',
      value: ['1 hour', '2 hours', '3 hours']
    }
  }
];

const diabetesQuestions = [
  {
    id: 'gen_diabetes_issues',
    text: 'Do you have generational issues related to diabetes?',
    sectionName: 'Family History',
    type: 'dropdown',
    options: ['Yes', 'No', 'Unknown']
  },
  {
    id: 'rheumatic_disorder',
    text: 'Epstein-Barr virus, Lyme disease, chronic fatigue syndrome, fibromyalgia, lupus, ankylosing spondylitis or other rheumatologic disorder?',
    sectionName: 'Medical History',
    type: 'checkbox',
    options: ['Yes']
  },
  {
    id: 'endocrine_disorder',
    text: 'Diabetes or a disorder of the thyroid, pituitary or adrenal glands?',
    sectionName: 'Medical History',
    type: 'checkbox',
    options: ['Yes']
  },
  {
    id: 'diabetes_type1',
    text: 'Type 1',
    sectionName: 'Diabetes Details',
    type: 'checkbox',
    options: ['Yes'],
    condition: {
      questionId: 'endocrine_disorder',
      value: ['Yes']
    }
  },
  {
    id: 'parents_diabetes',
    text: 'Parents had Diabetes',
    sectionName: 'Family History',
    type: 'checkbox',
    options: ['Yes'],
    condition: {
      questionId: 'diabetes_type1',
      value: ['Yes']
    }
  },
  {
    id: 'gen1_issues',
    text: 'Generation 1 issues?',
    sectionName: 'Family History',
    type: 'checkbox',
    options: ['Yes'],
    condition: {
      questionId: 'parents_diabetes',
      value: ['Yes']
    }
  },
  {
    id: 'gen_other',
    text: 'Generation Other',
    sectionName: 'Family History',
    type: 'text',
    min: 3,
    max: 100,
    condition: {
      questionId: 'parents_diabetes',
      value: ['Yes']
    }
  },
  {
    id: 'is_generational',
    text: 'Do you think it is generational',
    sectionName: 'Family History',
    type: 'radio',
    options: ['Yes', 'No'],
    condition: {
      questionId: 'parents_diabetes',
      value: ['Yes']
    }
  },
  {
    id: 'gen_details',
    text: 'Additional details',
    sectionName: 'Family History',
    type: 'text',
    min: 3,
    max: 1000,
    condition: {
      questionId: 'is_generational',
      value: 'Yes'
    }
  },
  {
    id: 'add_medication',
    text: 'Add your medication here',
    sectionName: 'Medications',
    type: 'medication',
    condition: {
      questionId: 'parents_diabetes',
      value: ['Yes']
    }
  },
  {
    id: 'no_history',
    text: 'No History its generational / time',
    sectionName: 'Family History',
    type: 'checkbox',
    options: ['Yes'],
    condition: {
      questionId: 'diabetes_type1',
      value: ['Yes']
    }
  }
];

export const questionsData: QuestionTemplate[] = [
  {
    state: 'CT',
    questions: [
      {
        id: 'Height',
        text: 'What is your height? (feet/inches or cm)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['ft/in', 'cm']
      },
      {
        id: 'Weight',
        text: 'What is your current weight? (lbs or kg)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['lbs', 'kg']
      },
      {
        id: 'WeightChanged',
        text: 'Has your weight changed by more than 10 pounds/5kg in the past 12 months?',
        sectionName: 'Height & Weight',
        type: 'boolean',
        subQuestions: [
          {
            id: 'WeightLoseRatio',
            text: 'How much weight did you gain or lose? (lbs or kg)',
            sectionName: 'Height & Weight',
            type: 'numeric',
            min: 0,
            max: 1000,
            units: ['lbs', 'kg'],
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          },
          {
            id: 'WeightLosIntention',
            text: 'Was this weight change intentional?',
            sectionName: 'Height & Weight',
            type: 'boolean',
            condition: {
              questionId: 'WeightChanged',
              value: true
            },
            subQuestions: [
              {
                id: 'WeightLoseMedication',
                text: 'Add Medication',
                sectionName: 'Height & Weight',
                type: 'medication',
                condition: {
                  questionId: 'WeightLosIntention',
                  value: true
                }
              }
            ]
          },
          {
            id: 'WeightChangeReason',
            text: 'What was the reason for this weight change?',
            sectionName: 'Height & Weight',
            type: 'text',
            min: 3,
            max: 1000,
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          }
        ]
      }
    ],
    sleepQuestions: sleepAssessmentQuestions,
    avocationQuestions: avocationQuestions,
    diabetesQuestions: diabetesQuestions
  },
  {
    state: 'CA',
    questions: [
      {
        id: 'Height',
        text: 'What is your height? (feet/inches or cm)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['ft/in', 'cm']
      },
      {
        id: 'Weight',
        text: 'What is your current weight? (lbs or kg)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['lbs', 'kg']
      },
      {
        id: 'WeightChanged',
        text: 'Has your weight changed by more than 10 pounds/5kg in the past 12 months?',
        sectionName: 'Height & Weight',
        type: 'boolean',
        subQuestions: [
          {
            id: 'WeightLoseRatio',
            text: 'How much weight did you gain or lose? (lbs or kg)',
            sectionName: 'Height & Weight',
            type: 'numeric',
            min: 0,
            max: 1000,
            units: ['lbs', 'kg'],
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          },
          {
            id: 'WeightLosIntention',
            text: 'Was this weight change intentional?',
            sectionName: 'Height & Weight',
            type: 'boolean',
            condition: {
              questionId: 'WeightChanged',
              value: true
            },
            subQuestions: [
              {
                id: 'WeightLoseMedication',
                text: 'Add Medication',
                sectionName: 'Height & Weight',
                type: 'medication',
                condition: {
                  questionId: 'WeightLosIntention',
                  value: true
                }
              }
            ]
          },
          {
            id: 'WeightChangeReason',
            text: 'What was the reason for this weight change?',
            sectionName: 'Height & Weight',
            type: 'text',
            min: 3,
            max: 1000,
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          }
        ]
      }
    ],
    avocationQuestions: avocationQuestions,
    diabetesQuestions: diabetesQuestions
  },
  {
    state: 'FL',
    questions: [
      {
        id: 'Height',
        text: 'What is your height? (feet/inches or cm)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['ft/in', 'cm']
      },
      {
        id: 'Weight',
        text: 'What is your current weight? (lbs or kg)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['lbs', 'kg']
      },
      {
        id: 'WeightChanged',
        text: 'Has your weight changed by more than 10 pounds/5kg in the past 12 months?',
        sectionName: 'Height & Weight',
        type: 'boolean',
        subQuestions: [
          {
            id: 'WeightLoseRatio',
            text: 'How much weight did you gain or lose? (lbs or kg)',
            sectionName: 'Height & Weight',
            type: 'numeric',
            min: 0,
            max: 1000,
            units: ['lbs', 'kg'],
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          },
          {
            id: 'WeightLosIntention',
            text: 'Was this weight change intentional?',
            sectionName: 'Height & Weight',
            type: 'boolean',
            condition: {
              questionId: 'WeightChanged',
              value: true
            },
            subQuestions: [
              {
                id: 'WeightLoseMedication',
                text: 'Add Medication',
                sectionName: 'Height & Weight',
                type: 'medication',
                condition: {
                  questionId: 'WeightLosIntention',
                  value: true
                }
              }
            ]
          },
          {
            id: 'WeightChangeReason',
            text: 'What was the reason for this weight change?',
            sectionName: 'Height & Weight',
            type: 'text',
            min: 3,
            max: 1000,
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          }
        ]
      }
    ],
    sleepQuestions: sleepAssessmentQuestions,
    avocationQuestions: avocationQuestions,
    diabetesQuestions: diabetesQuestions
  },
  {
    state: 'NJ',
    questions: [
      {
        id: 'Height',
        text: 'What is your height? (feet/inches or cm)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['ft/in', 'cm']
      },
      {
        id: 'Weight',
        text: 'What is your current weight? (lbs or kg)',
        sectionName: 'Height & Weight',
        type: 'numeric',
        min: 1,
        max: 1000,
        units: ['lbs', 'kg']
      },
      {
        id: 'WeightChanged',
        text: 'Has your weight changed by more than 10 pounds/5kg in the past 12 months?',
        sectionName: 'Height & Weight',
        type: 'boolean',
        subQuestions: [
          {
            id: 'WeightLoseRatio',
            text: 'How much weight did you gain or lose? (lbs or kg)',
            sectionName: 'Height & Weight',
            type: 'numeric',
            min: 0,
            max: 1000,
            units: ['lbs', 'kg'],
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          },
          {
            id: 'WeightLosIntention',
            text: 'Was this weight change intentional?',
            sectionName: 'Height & Weight',
            type: 'boolean',
            condition: {
              questionId: 'WeightChanged',
              value: true
            },
            subQuestions: [
              {
                id: 'WeightLoseMedication',
                text: 'Add Medication',
                sectionName: 'Height & Weight',
                type: 'medication',
                condition: {
                  questionId: 'WeightLosIntention',
                  value: true
                }
              }
            ]
          },
          {
            id: 'WeightChangeReason',
            text: 'What was the reason for this weight change?',
            sectionName: 'Height & Weight',
            type: 'text',
            min: 3,
            max: 1000,
            condition: {
              questionId: 'WeightChanged',
              value: true
            }
          }
        ]
      }
    ],
    avocationQuestions: avocationQuestions,
    diabetesQuestions: diabetesQuestions
  }
];
/* =====================================================================
   CONDITIONS.JS: all the questions of the game
   =====================================================================

   Each question is one block between { and }, followed by a comma.

   {
     id: "e099",                  // unique name. e = easy (1), h = hard (2), x = extreme (3)
     level: 1,                    // 1 = easy, 2 = hard, 3 = extreme
     answer: 3,                   // how many presses are correct (0 = don't press)
     text: "Wheels on a tricycle.",  // what the player reads (60 characters max)
     note: "Tricycle = 3 wheels."     // for you only: why the answer is right
   },

   HOW TO ADD A QUESTION
   1. Copy the example above (from { to },).
   2. Paste it inside the list, next to the other questions of the same level.
   3. Give it a new id that no other question uses (e.g. the next number).
   4. Change level, answer, text and note.

   HOW TO REMOVE A QUESTION
   Delete its whole block, from { to }, (including the comma).

   RULES FOR A GOOD QUESTION
   - Only ONE correct answer anywhere in the world. Avoid things that change
     by country or school (continents, oceans, planets, rainbow colors,
     months, seasons, weekend days, holiday dates…).
   - Answers from 0 to 12 (extreme may go up to 15).
   - Short: 60 characters max, so it fits on a phone.
   - Always write the reason in note, so you can check it later.
   - If the text needs a quote mark, use ' (single) inside the "double" ones.
   ===================================================================== */

window.CONDITIONS = [

  // =================================================================
  // LEVEL 1: EASY. Direct instructions and very simple riddles.
  // =================================================================

  // --- Direct instructions ---
  { id: "e001", level: 1, answer: 1,  text: "Press 1 time.",            note: "Straight instruction" },
  { id: "e002", level: 1, answer: 2,  text: "Press 2 times.",           note: "Straight instruction" },
  { id: "e003", level: 1, answer: 3,  text: "Press 3 times.",           note: "Straight instruction" },
  { id: "e004", level: 1, answer: 4,  text: "Press 4 times.",           note: "Straight instruction" },
  { id: "e005", level: 1, answer: 5,  text: "Press 5 times.",           note: "Straight instruction" },
  { id: "e006", level: 1, answer: 6,  text: "Press 6 times.",           note: "Straight instruction" },
  { id: "e007", level: 1, answer: 7,  text: "Press 7 times.",           note: "Straight instruction" },
  { id: "e008", level: 1, answer: 8,  text: "Press 8 times.",           note: "Straight instruction" },
  { id: "e009", level: 1, answer: 9,  text: "Press 9 times.",           note: "Straight instruction" },
  { id: "e010", level: 1, answer: 10, text: "Press 10 times.",          note: "Straight instruction" },
  { id: "e011", level: 1, answer: 11, text: "Press 11 times.",          note: "Straight instruction" },
  { id: "e012", level: 1, answer: 12, text: "Press 12 times.",          note: "Straight instruction" },
  { id: "e013", level: 1, answer: 1,  text: "Press once.",              note: "Once = 1" },
  { id: "e014", level: 1, answer: 2,  text: "Press twice.",             note: "Twice = 2" },
  { id: "e015", level: 1, answer: 3,  text: "Press three times.",       note: "Straight instruction, in words" },
  { id: "e016", level: 1, answer: 4,  text: "Press it four times.",     note: "Straight instruction, in words" },
  { id: "e017", level: 1, answer: 5,  text: "Tap five times.",          note: "Straight instruction, in words" },
  { id: "e018", level: 1, answer: 6,  text: "Tap it six times.",        note: "Straight instruction, in words" },
  { id: "e019", level: 1, answer: 2,  text: "Double tap.",              note: "Double = 2" },
  { id: "e020", level: 1, answer: 3,  text: "Triple tap.",              note: "Triple = 3" },

  // --- "Don't press" (the signature moment: about 5% of this level) ---
  { id: "e021", level: 1, answer: 0,  text: "Don't press.",             note: "Zero presses" },
  { id: "e022", level: 1, answer: 0,  text: "Do not touch the button.", note: "Zero presses" },

  // --- Trivial riddles ---
  { id: "e023", level: 1, answer: 7,  text: "Press once for every day of the week.", note: "7 days in a week" },
  { id: "e024", level: 1, answer: 4,  text: "Rings in the Audi logo.",     note: "The Audi logo has 4 rings" },
  { id: "e025", level: 1, answer: 3,  text: "Wheels on a tricycle.",       note: "Tri = 3 wheels" },
  { id: "e026", level: 1, answer: 2,  text: "Wheels on a bicycle.",        note: "Bi = 2 wheels" },
  { id: "e027", level: 1, answer: 1,  text: "Wheels on a unicycle.",       note: "Uni = 1 wheel" },
  { id: "e028", level: 1, answer: 3,  text: "Sides of a triangle.",        note: "A triangle has 3 sides" },
  { id: "e029", level: 1, answer: 4,  text: "Sides of a square.",          note: "A square has 4 sides" },
  { id: "e030", level: 1, answer: 4,  text: "Sides of a rectangle.",       note: "A rectangle has 4 sides" },
  { id: "e031", level: 1, answer: 8,  text: "Legs on a spider.",           note: "Spiders have 8 legs" },
  { id: "e032", level: 1, answer: 4,  text: "Legs on a dog.",              note: "Dogs have 4 legs" },
  { id: "e033", level: 1, answer: 4,  text: "Legs on a cow.",              note: "Cows have 4 legs" },
  { id: "e034", level: 1, answer: 2,  text: "Legs on a chicken.",          note: "Chickens have 2 legs" },
  { id: "e035", level: 1, answer: 0,  text: "Legs on a snake.",            note: "Snakes have no legs: don't press!" },
  { id: "e036", level: 1, answer: 5,  text: "Toes on one foot.",           note: "5 toes per foot" },
  { id: "e037", level: 1, answer: 10, text: "Toes on two feet.",           note: "5 + 5 = 10" },
  { id: "e038", level: 1, answer: 2,  text: "Eyes on a human face.",       note: "2 eyes" },
  { id: "e039", level: 1, answer: 1,  text: "Noses on your face.",         note: "1 nose" },
  { id: "e040", level: 1, answer: 1,  text: "Hearts in the human body.",   note: "1 heart" },
  { id: "e041", level: 1, answer: 1,  text: "Horns on a unicorn.",         note: "Uni = 1 horn" },
  { id: "e042", level: 1, answer: 1,  text: "Eyes on a cyclops.",          note: "A cyclops has 1 eye" },
  { id: "e043", level: 1, answer: 1,  text: "Trunks on an elephant.",      note: "1 trunk" },
  { id: "e044", level: 1, answer: 2,  text: "Wings on a bird.",            note: "Birds have 2 wings" },
  { id: "e045", level: 1, answer: 1,  text: "Suns in our solar system.",   note: "One Sun" },
  { id: "e046", level: 1, answer: 3,  text: "Legs on a tripod.",           note: "Tri = 3 legs" },
  { id: "e047", level: 1, answer: 4,  text: "Wheels on a skateboard.",     note: "A skateboard has 4 wheels" },
  { id: "e048", level: 1, answer: 3,  text: "Colors on a traffic light.",  note: "Red, amber/yellow, green = 3" },
  { id: "e049", level: 1, answer: 2,  text: "Players in a game of chess.", note: "Chess is played by 2 players" },
  { id: "e050", level: 1, answer: 2,  text: "Players in a tennis singles match.", note: "Singles = 1 vs 1 = 2 players" },
  { id: "e051", level: 1, answer: 5,  text: "Fingers on one hand.",        note: "5 fingers" },
  { id: "e052", level: 1, answer: 10, text: "Fingers on two hands.",       note: "5 + 5 = 10" },
  { id: "e053", level: 1, answer: 4,  text: "Wheels on a typical car.",    note: "4 wheels" },
  { id: "e054", level: 1, answer: 12, text: "Eggs in a dozen.",            note: "A dozen = 12" },
  { id: "e055", level: 1, answer: 6,  text: "Eggs in a half dozen.",       note: "Half a dozen = 6" },
  { id: "e056", level: 1, answer: 6,  text: "Faces on a standard die.",    note: "A die has 6 faces" },
  { id: "e057", level: 1, answer: 2,  text: "Ears on a cat.",              note: "2 ears" },
  { id: "e058", level: 1, answer: 1,  text: "Tails on a dog.",             note: "1 tail" },
  { id: "e059", level: 1, answer: 2,  text: "Knees on a human.",           note: "2 knees" },
  { id: "e060", level: 1, answer: 3,  text: "Letters in the word 'YES'.",  note: "Y-E-S = 3" },
  { id: "e061", level: 1, answer: 2,  text: "Letters in the word 'NO'.",   note: "N-O = 2" },
  { id: "e062", level: 1, answer: 3,  text: "Corners of a triangle.",      note: "A triangle has 3 corners" },
  { id: "e063", level: 1, answer: 2,  text: "Wheels on a motorcycle.",     note: "2 wheels" },
  { id: "e064", level: 1, answer: 3,  text: "Holes in a bowling ball.",    note: "A bowling ball has 3 finger holes" },
  { id: "e065", level: 1, answer: 2,  text: "Players in a pair.",          note: "A pair = 2" },
  { id: "e066", level: 1, answer: 0,  text: "Press none.",                 note: "None = zero presses" },
  { id: "e067", level: 1, answer: 2,  text: "One plus one.",               note: "1 + 1 = 2" },
  { id: "e068", level: 1, answer: 5,  text: "Three plus two.",             note: "3 + 2 = 5" },
  { id: "e069", level: 1, answer: 4,  text: "Letters in the word 'GAME'.", note: "G-A-M-E = 4" },
  { id: "e070", level: 1, answer: 1,  text: "Thumbs on one hand.",         note: "1 thumb" },

  // =================================================================
  // LEVEL 2: HARD. Simple math, general knowledge, mild tricks.
  // =================================================================

  // --- Simple math ---
  { id: "h001", level: 2, answer: 5,  text: "Press (12 ÷ 4) + 2 times.",     note: "12 ÷ 4 = 3, + 2 = 5" },
  { id: "h002", level: 2, answer: 7,  text: "Press (15 − 8) times.",         note: "15 − 8 = 7" },
  { id: "h003", level: 2, answer: 9,  text: "Press (2 × 5) − 1 times.",      note: "2 × 5 = 10, − 1 = 9" },
  { id: "h004", level: 2, answer: 4,  text: "Press (20 ÷ 5) times.",         note: "20 ÷ 5 = 4" },
  { id: "h005", level: 2, answer: 6,  text: "Press half a dozen times.",     note: "A dozen = 12, half = 6" },
  { id: "h006", level: 2, answer: 10, text: "Press (100 ÷ 10) times.",       note: "100 ÷ 10 = 10" },
  { id: "h007", level: 2, answer: 0,  text: "Press (7 × 0) times.",          note: "Anything × 0 = 0: don't press!" },
  { id: "h008", level: 2, answer: 4,  text: "Press the square root of 16 times.", note: "4 × 4 = 16" },
  { id: "h009", level: 2, answer: 8,  text: "Press 2 cubed times.",          note: "2 × 2 × 2 = 8" },
  { id: "h010", level: 2, answer: 11, text: "Press (5 + 5 + 1) times.",      note: "5 + 5 + 1 = 11" },
  { id: "h011", level: 2, answer: 12, text: "Press (24 ÷ 2) times.",         note: "24 ÷ 2 = 12" },
  { id: "h012", level: 2, answer: 6,  text: "Press (1 + 2 + 3) times.",      note: "1 + 2 + 3 = 6" },
  { id: "h013", level: 2, answer: 5,  text: "Press 10% of 50 times.",        note: "10% of 50 = 5" },
  { id: "h014", level: 2, answer: 9,  text: "Press a quarter of 36 times.",  note: "36 ÷ 4 = 9" },
  { id: "h015", level: 2, answer: 10, text: "Press (8 − 3) × 2 times.",      note: "8 − 3 = 5, × 2 = 10" },
  { id: "h016", level: 2, answer: 6,  text: "Press 2 + 2 × 2 times.",        note: "Trick: multiply first. 2 × 2 = 4, + 2 = 6 (not 8)" },
  { id: "h017", level: 2, answer: 1,  text: "Press (4 × 3) − 11 times.",     note: "4 × 3 = 12, − 11 = 1" },
  { id: "h018", level: 2, answer: 3,  text: "Press a third of 9 times.",     note: "9 ÷ 3 = 3" },

  // --- General knowledge ---
  { id: "h019", level: 2, answer: 2,  text: "How many Koreas exist?",               note: "North Korea and South Korea" },
  { id: "h020", level: 2, answer: 6,  text: "Players per side in indoor volleyball.", note: "Indoor volleyball: 6 per team on court" },
  { id: "h021", level: 2, answer: 11, text: "Players per team on a soccer field.",  note: "Soccer: 11 per team on the field" },
  { id: "h022", level: 2, answer: 4,  text: "Players in a tennis doubles match.",   note: "Doubles = 2 vs 2 = 4 players" },
  { id: "h023", level: 2, answer: 6,  text: "Legs on an insect.",                   note: "All insects have 6 legs" },
  { id: "h024", level: 2, answer: 8,  text: "Arms on an octopus.",                  note: "Octo = 8 arms" },
  { id: "h025", level: 2, answer: 3,  text: "Hearts in an octopus.",                note: "An octopus has 3 hearts" },
  { id: "h026", level: 2, answer: 1,  text: "Humps on a dromedary camel.",          note: "Dromedary = 1 hump (Bactrian = 2)" },
  { id: "h027", level: 2, answer: 4,  text: "Strings on a violin.",                 note: "A violin has 4 strings" },
  { id: "h028", level: 2, answer: 6,  text: "Strings on a standard guitar.",        note: "A standard guitar has 6 strings" },
  { id: "h029", level: 2, answer: 5,  text: "Sides of a pentagon.",                 note: "Penta = 5" },
  { id: "h030", level: 2, answer: 6,  text: "Sides of a hexagon.",                  note: "Hexa = 6" },
  { id: "h031", level: 2, answer: 8,  text: "Sides of an octagon.",                 note: "Octa = 8" },
  { id: "h032", level: 2, answer: 6,  text: "Faces on a cube.",                     note: "A cube has 6 faces" },
  { id: "h033", level: 2, answer: 8,  text: "Corners on a cube.",                   note: "A cube has 8 corners" },
  { id: "h034", level: 2, answer: 5,  text: "Rings on the Olympic flag.",           note: "The Olympic flag has 5 rings" },
  { id: "h035", level: 2, answer: 2,  text: "Kings on a chessboard at the start.",  note: "1 white king + 1 black king" },
  { id: "h036", level: 2, answer: 12, text: "Numbers on a classic clock face.",     note: "1 to 12" },
  { id: "h037", level: 2, answer: 4,  text: "Chambers in the human heart.",         note: "2 atria + 2 ventricles" },
  { id: "h038", level: 2, answer: 9,  text: "Wheels on three tricycles.",           note: "3 × 3 = 9" },

  // --- Mild tricks: letters, words and numbers ---
  { id: "h039", level: 2, answer: 3,  text: "Press the number of letters in 'CAT'.", note: "C-A-T = 3" },
  { id: "h040", level: 2, answer: 3,  text: "Vowels in the word 'BANANA'.",         note: "A, A, A = 3" },
  { id: "h041", level: 2, answer: 6,  text: "Letters in the word 'BUTTON'.",        note: "B-U-T-T-O-N = 6" },
  { id: "h042", level: 2, answer: 4,  text: "Letters in the word 'NINE'.",          note: "Trick: N-I-N-E = 4 (not 9)" },
  { id: "h043", level: 2, answer: 4,  text: "How many S's in 'MISSISSIPPI'?",       note: "MI-SS-I-SS-IPPI = 4" },
  { id: "h044", level: 2, answer: 2,  text: "How many P's in 'APPLE'?",             note: "A-PP-LE = 2" },
  { id: "h045", level: 2, answer: 3,  text: "Zeros in one thousand.",               note: "1000 = 3 zeros" },
  { id: "h046", level: 2, answer: 6,  text: "Zeros in one million.",                note: "1000000 = 6 zeros" },
  { id: "h047", level: 2, answer: 4,  text: "Digits in the number 2026.",           note: "2-0-2-6 = 4 digits" },
  { id: "h048", level: 2, answer: 7,  text: "Press once per word in this sentence.", note: "Press / once / per / word / in / this / sentence = 7" },
  { id: "h049", level: 2, answer: 4,  text: "Wheels on two bicycles.",              note: "2 × 2 = 4" },
  { id: "h050", level: 2, answer: 6,  text: "Legs on three ducks.",                 note: "3 × 2 = 6" },
  { id: "h051", level: 2, answer: 5,  text: "Players on a basketball court per team.", note: "5 per team on court" },
  { id: "h052", level: 2, answer: 9,  text: "Squares on a tic-tac-toe board.",      note: "3 × 3 = 9" },
  { id: "h053", level: 2, answer: 8,  text: "Bits in one byte.",                    note: "1 byte = 8 bits" },
  { id: "h054", level: 2, answer: 6,  text: "Letters in the word 'ELEVEN'.",        note: "Trick: E-L-E-V-E-N = 6 (not 11)" },
  { id: "h055", level: 2, answer: 6,  text: "Letters in the word 'TWELVE'.",        note: "Trick: T-W-E-L-V-E = 6 (not 12)" },
  { id: "h056", level: 2, answer: 5,  text: "Minutes in an hour divided by 12.",    note: "60 ÷ 12 = 5" },
  { id: "h057", level: 2, answer: 12, text: "Hours shown on a half-day clock.",     note: "A 12-hour clock shows 12 hours" },
  { id: "h058", level: 2, answer: 12, text: "Legs on two insects.",                 note: "6 × 2 = 12" },
  { id: "h059", level: 2, answer: 4,  text: "Strings on a ukulele.",                note: "A ukulele has 4 strings" },
  { id: "h060", level: 2, answer: 12, text: "Keys in one piano octave.",            note: "7 white + 5 black = 12" },
  { id: "h061", level: 2, answer: 8,  text: "Pawns per side at the start of chess.", note: "8 pawns per side" },
  { id: "h062", level: 2, answer: 2,  text: "Bishops per side in chess.",           note: "2 bishops per side" },
  { id: "h063", level: 2, answer: 2,  text: "How many O's in 'BOOKKEEPER'?",        note: "B-OO-KKEEPER = 2" },
  { id: "h064", level: 2, answer: 4,  text: "Prime numbers from 1 to 10.",          note: "2, 3, 5, 7 (1 is not prime)" },
  { id: "h065", level: 2, answer: 3,  text: "Press (9 − 3) ÷ 2 times.",             note: "6 ÷ 2 = 3" },
  { id: "h066", level: 2, answer: 5,  text: "Press 3 squared minus 4 times.",       note: "9 − 4 = 5" },
  { id: "h067", level: 2, answer: 5,  text: "Faces on a square pyramid.",           note: "4 triangles + 1 square = 5" },
  { id: "h068", level: 2, answer: 6,  text: "Edges on a tetrahedron.",              note: "A tetrahedron has 6 edges" },
  { id: "h069", level: 2, answer: 3,  text: "How many D's in 'ADDED'?",             note: "A-DD-E-D = 3" },
  { id: "h070", level: 2, answer: 4,  text: "Quarters in a whole.",                 note: "4 quarters make 1 whole" },

  // =================================================================
  // LEVEL 3: EXTREME. Used as a small share of Hard mode (and a future Extreme mode).
  // Multi-step logic, tricky wording, bigger mental math. Answers up to 15.
  // =================================================================

  { id: "x005", level: 3, answer: 7,  text: "Press the number of letters in 'FIFTEEN'.",    note: "Trick: F-I-F-T-E-E-N = 7 (not 15)" },
  { id: "x006", level: 3, answer: 10, text: "Press once per letter from A to J.",           note: "A B C D E F G H I J = 10" },
  { id: "x007", level: 3, answer: 3,  text: "Minutes in a quarter hour, divided by 5.",     note: "15 ÷ 5 = 3" },
  { id: "x008", level: 3, answer: 5, text: "Press (1 + 2 + 3 + 4 + 5) − 10 times.",         note: "15 − 10 = 5" },
  { id: "x010", level: 3, answer: 12, text: "Press 144 ÷ 12 times",                         note: "144 ÷ 12 = 12" },
  { id: "x011", level: 3, answer: 6,  text: "Legs on a tripod times wheels on a bike.",     note: "3 × 2 = 6" },
  { id: "x012", level: 3, answer: 4,  text: "Vowels in 'EXTREME' plus consonants in 'ONE'.", note: "E, E, E = 3; N = 1; 3 + 1 = 4" },
  { id: "x013", level: 3, answer: 0,  text: "Press (9 × 9) − 81 times.",                    note: "81 − 81 = 0: don't press!" },
  { id: "x014", level: 3, answer: 4,  text: "How many E's in 'EXCELLENCE'?",                note: "E-XC-E-LL-E-NC-E = 4" },
  { id: "x015", level: 3, answer: 5,  text: "Hours in a day ÷ 2, minus days in a week.",    note: "24 ÷ 2 = 12, − 7 = 5" },
  { id: "x016", level: 3, answer: 15, text: "Press (5 × 5) − 10 times.",                    note: "25 − 10 = 15" },
  { id: "x017", level: 3, answer: 13, text: "Letters in 'THIRTEEN' plus 5.",                note: "8 + 5 = 13" },
  { id: "x018", level: 3, answer: 13, text: "Sides of an octagon plus a pentagon.",         note: "8 + 5 = 13" },
  { id: "x019", level: 3, answer: 15, text: "Hours in a day minus sides of a nonagon.",     note: "24 − 9 = 15" },
  { id: "x020", level: 3, answer: 15, text: "Press half of 30 times.",                      note: "30 ÷ 2 = 15" },
  { id: "x021", level: 3, answer: 15, text: "Press 2 to the power of 4, minus 1 times.",    note: "16 − 1 = 15" },
  { id: "x022", level: 3, answer: 5,  text: "Vowels in the word 'EDUCATION'.",              note: "E, U, A, I, O = 5" },
  { id: "x023", level: 3, answer: 14, text: "Cube root of 8, times 7.",                     note: "2 × 7 = 14" },
  { id: "x024", level: 3, answer: 13, text: "Next Fibonacci number after 1,1,2,3,5,8.",     note: "8 + 5 = 13" },
  { id: "x025", level: 3, answer: 5,  text: "Roman numeral X minus V.",                     note: "10 − 5 = 5" },
  { id: "x026", level: 3, answer: 13, text: "Press (11 × 2) − 9 times.",                    note: "22 − 9 = 13" },
  { id: "x027", level: 3, answer: 15, text: "Press once per letter from A to O.",           note: "A through O = 15" },
  { id: "x028", level: 3, answer: 0,  text: "Press (6 × 6) − 36 times.",                    note: "36 − 36 = 0: don't press!" },
  { id: "x029", level: 3, answer: 14, text: "Corners on a cube plus faces on a cube.",      note: "8 + 6 = 14" },
  { id: "x030", level: 3, answer: 12, text: "Olympic rings plus days of the week.",         note: "5 + 7 = 12" },
  { id: "x031", level: 3, answer: 15, text: "Seconds in a quarter minute.",                 note: "60 ÷ 4 = 15" },
  { id: "x032", level: 3, answer: 15, text: "3 cubed minus 12.",                            note: "27 − 12 = 15" },
  { id: "x033", level: 3, answer: 4,  text: "How many I's in 'MISSISSIPPI'?",               note: "M-I-SS-I-SS-I-PP-I = 4" },
  { id: "x034", level: 3, answer: 11, text: "Sides of a hexagon plus sides of a pentagon.", note: "6 + 5 = 11" },
  { id: "x035", level: 3, answer: 9,  text: "Letters in 'BUTTON' plus letters in 'CAT'.",   note: "6 + 3 = 9" }
];

import dotenv from 'dotenv';
dotenv.config();
import connectDB from "../config/db.js";
import User from '../models/userModel.js'
import Menu from '../models/menuModel.js';
import OffDay from '../models/offDayModel.js';
import Booking from '../models/bookingModel.js';
import GuestBooking from '../models/GuestBookingModel.js';
import Rebate from '../models/rebateModel.js';

const seedData = async () => {
    try {
        connectDB();

        // Clear existing
        await Promise.all([
            User.deleteMany(),
            Menu.deleteMany(),
            OffDay.deleteMany(),
            Booking.deleteMany(),
            GuestBooking.deleteMany(),
            Rebate.deleteMany()
        ]);

        // Users
        // const users = await User.insertMany([
        //     { id: 39, email: 'resident_39@jubileehall.com', name: 'Aryan Shukla', role: 'resident' },
        //     { id: 0, email: 'admin@jubileehall.com', name: 'Admin User', role: 'admin' }
        // ]);
        const users = await User.insertMany([
            {
                id: 0,
                email: 'admin@jubileehall.com',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin'
            },
            { id: 1, email: 'resident_1@jubileehall.com', password: 'resident@1', name: 'Debanik Panda', role: 'resident' },
            { id: 2, email: 'resident_2@jubileehall.com', password: 'resident@2', name: 'Kumar Abhishek', role: 'resident' },
            { id: 3, email: 'resident_3@jubileehall.com', password: 'resident@3', name: 'Rohan Singh', role: 'resident' },
            { id: 4, email: 'resident_4@jubileehall.com', password: 'resident@4', name: 'Shougrakpam Utam Kumar Singh', role: 'resident' },
            { id: 5, email: 'resident_5@jubileehall.com', password: 'resident@5', name: 'Mehul Singh', role: 'resident' },
            { id: 7, email: 'resident_7@jubileehall.com', password: 'resident@7', name: 'Tapan Bharadwaj', role: 'resident' },
            { id: 8, email: 'resident_8@jubileehall.com', password: 'resident@8', name: 'Manikanta Goud Bairu', role: 'resident' },
            { id: 9, email: 'resident_9@jubileehall.com', password: 'resident@9', name: 'Akshat Kukkar', role: 'resident' },
            { id: 10, email: 'resident_10@jubileehall.com', password: 'resident@10', name: 'Mukesh Behera', role: 'resident' },
            { id: 11, email: 'resident_11@jubileehall.com', password: 'resident@11', name: 'Kushal', role: 'resident' },
            { id: 12, email: 'resident_12@jubileehall.com', password: 'resident@12', name: 'Adarsh Choudhury', role: 'resident' },
            { id: 13, email: 'resident_13@jubileehall.com', password: 'resident@13', name: 'Kamal Choudhary', role: 'resident' },
            { id: 15, email: 'resident_15@jubileehall.com', password: 'resident@15', name: 'Thakur Anjeev Prakash', role: 'resident' },
            { id: 16, email: 'resident_16@jubileehall.com', password: 'resident@16', name: 'Sumit Kumar Tiwari', role: 'resident' },
            { id: 17, email: 'resident_17@jubileehall.com', password: 'resident@17', name: 'Arpit Mahajan', role: 'resident' },
            { id: 18, email: 'resident_18@jubileehall.com', password: 'resident@18', name: 'Ashish Mishra', role: 'resident' },
            { id: 19, email: 'resident_19@jubileehall.com', password: 'resident@19', name: 'Saurabh Verma', role: 'resident' },
            { id: 20, email: 'resident_20@jubileehall.com', password: 'resident@20', name: 'Nikhil Shukla', role: 'resident' },
            { id: 21, email: 'resident_21@jubileehall.com', password: 'resident@21', name: 'Ajay Pal Guneshwal', role: 'resident' },
            { id: 22, email: 'resident_22@jubileehall.com', password: 'resident@22', name: 'Hritik Yadav', role: 'resident' },
            { id: 23, email: 'resident_23@jubileehall.com', password: 'resident@23', name: 'Ayush Varun', role: 'resident' },
            { id: 241, email: 'resident_24A@jubileehall.com', password: 'resident@24A', name: 'Ashish Pal', role: 'resident' },
            { id: 242, email: 'resident_24B@jubileehall.com', password: 'resident@24B', name: 'Santosh Kumar', role: 'resident' },
            { id: 25, email: 'resident_25@jubileehall.com', password: 'resident@25', name: 'Aditya Kumar', role: 'resident' },
            { id: 26, email: 'resident_26@jubileehall.com', password: 'resident@26', name: 'Deepak Sah', role: 'resident' },
            { id: 27, email: 'resident_27@jubileehall.com', password: 'resident@27', name: 'Manish Singh Rawat', role: 'resident' },
            { id: 28, email: 'resident_28@jubileehall.com', password: 'resident@28', name: 'Gaurav', role: 'resident' },
            { id: 30, email: 'resident_30@jubileehall.com', password: 'resident@30', name: 'Gaurav Daemrot', role: 'resident' },
            { id: 33, email: 'resident_33@jubileehall.com', password: 'resident@33', name: 'Stanzin Kunphel', role: 'resident' },
            { id: 34, email: 'resident_34@jubileehall.com', password: 'resident@34', name: 'Geo Madit Koryom Leek', role: 'resident' },
            { id: 35, email: 'resident_35@jubileehall.com', password: 'resident@35', name: 'Vidit Verma', role: 'resident' },
            { id: 37, email: 'resident_37@jubileehall.com', password: 'resident@37', name: 'Vimlesh Kumar Saket', role: 'resident' },
            { id: 38, email: 'resident_38@jubileehall.com', password: 'resident@38', name: 'Aashish', role: 'resident' },
            { id: 39, email: 'resident_39@jubileehall.com', password: 'resident@39', name: 'Aryan Shukla', role: 'resident' },
            { id: 40, email: 'resident_40@jubileehall.com', password: 'resident@40', name: 'Odao Ngenyt Kichere', role: 'resident' },
            { id: 41, email: 'resident_41@jubileehall.com', password: 'resident@41', name: 'Kanav Mehra', role: 'resident' },
            { id: 42, email: 'resident_42@jubileehall.com', password: 'resident@42', name: 'Sahil', role: 'resident' },
            { id: 43, email: 'resident_43@jubileehall.com', password: 'resident@43', name: 'Suyash Sudhanshu Shekhar', role: 'resident' },
            { id: 44, email: 'resident_44@jubileehall.com', password: 'resident@44', name: 'Mohit', role: 'resident' },
            { id: 45, email: 'resident_45@jubileehall.com', password: 'resident@45', name: 'Vishal Sinha', role: 'resident' },
            { id: 47, email: 'resident_47@jubileehall.com', password: 'resident@47', name: 'Shivam Mishra', role: 'resident' },
            { id: 48, email: 'resident_48@jubileehall.com', password: 'resident@48', name: 'Anas Zaman', role: 'resident' },
            { id: 49, email: 'resident_49@jubileehall.com', password: 'resident@49', name: 'Tumisang Makabe', role: 'resident' },
            { id: 50, email: 'resident_50@jubileehall.com', password: 'resident@50', name: 'Khirus Pegu', role: 'resident' },
            { id: 52, email: 'resident_52@jubileehall.com', password: 'resident@52', name: 'Ven Jayanta', role: 'resident' },
            { id: 53, email: 'resident_53@jubileehall.com', password: 'resident@53', name: 'Vishal Narayan Singh', role: 'resident' },
            { id: 54, email: 'resident_54@jubileehall.com', password: 'resident@54', name: 'Nishant Shekher Jha', role: 'resident' },
            { id: 55, email: 'resident_55@jubileehall.com', password: 'resident@55', name: 'Pradyumn Attri', role: 'resident' },
            { id: 56, email: 'resident_56@jubileehall.com', password: 'resident@56', name: 'Abdul Razzaque', role: 'resident' },
            { id: 57, email: 'resident_57@jubileehall.com', password: 'resident@57', name: 'Raunak Raj', role: 'resident' },
            { id: 59, email: 'resident_59@jubileehall.com', password: 'resident@59', name: 'Md. Saalim Farooq Bhat', role: 'resident' },
            { id: 60, email: 'resident_60@jubileehall.com', password: 'resident@60', name: 'Fancy Jamatia', role: 'resident' },
            { id: 61, email: 'resident_61@jubileehall.com', password: 'resident@61', name: 'Mohd Ashraf Bhat', role: 'resident' },
            { id: 62, email: 'resident_62@jubileehall.com', password: 'resident@62', name: 'Kundan Kumar Chaudhary', role: 'resident' },
            { id: 64, email: 'resident_64@jubileehall.com', password: 'resident@64', name: 'Ongulu Ricky Fely', role: 'resident' },
            { id: 65, email: 'resident_65@jubileehall.com', password: 'resident@65', name: 'Sri Harsha Mogiligundla', role: 'resident' },
            { id: 67, email: 'resident_67@jubileehall.com', password: 'resident@67', name: 'Bidyut Chutia', role: 'resident' },
            { id: 68, email: 'resident_68@jubileehall.com', password: 'resident@68', name: 'Arpit Pandey', role: 'resident' },
            { id: 70, email: 'resident_70@jubileehall.com', password: 'resident@70', name: 'Ankit Kumar Shah', role: 'resident' },
            { id: 71, email: 'resident_71@jubileehall.com', password: 'resident@71', name: 'Aman Rao', role: 'resident' },
            { id: 72, email: 'resident_72@jubileehall.com', password: 'resident@72', name: 'Aryan Yadav', role: 'resident' },
            { id: 73, email: 'resident_73@jubileehall.com', password: 'resident@73', name: 'Sumit Raj', role: 'resident' },
            { id: 74, email: 'resident_74@jubileehall.com', password: 'resident@74', name: 'Hitesh Lamba', role: 'resident' },
            { id: 75, email: 'resident_75@jubileehall.com', password: 'resident@75', name: 'Rachagorla Naveen Kumar', role: 'resident' },
            { id: 76, email: 'resident_76@jubileehall.com', password: 'resident@76', name: 'Pushalal Ganesh', role: 'resident' },
            { id: 78, email: 'resident_78@jubileehall.com', password: 'resident@78', name: 'Sambit Kumar Mallik', role: 'resident' },
            { id: 79, email: 'resident_79@jubileehall.com', password: 'resident@79', name: 'Ram Gurjar', role: 'resident' },
            { id: 80, email: 'resident_80@jubileehall.com', password: 'resident@80', name: 'Raman Kumar', role: 'resident' },
            { id: 81, email: 'resident_81@jubileehall.com', password: 'resident@81', name: 'Jitender Singh', role: 'resident' },
            { id: 82, email: 'resident_82@jubileehall.com', password: 'resident@82', name: 'Sandeep Singh Rathore', role: 'resident' },
            { id: 83, email: 'resident_83@jubileehall.com', password: 'resident@83', name: 'Akhilesh Yadav', role: 'resident' },
            { id: 84, email: 'resident_84@jubileehall.com', password: 'resident@84', name: 'Kumar Anurag', role: 'resident' },
            { id: 85, email: 'resident_85@jubileehall.com', password: 'resident@85', name: 'Nishant Chaudhary', role: 'resident' },
            { id: 86, email: 'resident_86@jubileehall.com', password: 'resident@86', name: 'Harsh Vashishtha', role: 'resident' },
            { id: 88, email: 'resident_88@jubileehall.com', password: 'resident@88', name: 'Stanzin Norboo', role: 'resident' },
            { id: 89, email: 'resident_89@jubileehall.com', password: 'resident@89', name: 'Ashish', role: 'resident' },
            { id: 90, email: 'resident_90@jubileehall.com', password: 'resident@90', name: 'Arvind Kumar', role: 'resident' },
            { id: 91, email: 'resident_91@jubileehall.com', password: 'resident@91', name: 'Alok Deep', role: 'resident' },
            { id: 92, email: 'resident_92@jubileehall.com', password: 'resident@92', name: 'Saksham Rai', role: 'resident' },
            { id: 93, email: 'resident_93@jubileehall.com', password: 'resident@93', name: 'Arpit Barthwal', role: 'resident' },
            { id: 95, email: 'resident_95@jubileehall.com', password: 'resident@95', name: 'Amit Kumar', role: 'resident' },
            { id: 96, email: 'resident_96@jubileehall.com', password: 'resident@96', name: 'Manish Jaiswal', role: 'resident' },
            { id: 97, email: 'resident_97@jubileehall.com', password: 'resident@97', name: 'Antrix Lagwal', role: 'resident' },
            { id: 98, email: 'resident_98@jubileehall.com', password: 'resident@98', name: 'Afsal Rahman PP', role: 'resident' },
            { id: 100, email: 'resident_100@jubileehall.com', password: 'resident@100', name: 'Amit Prakash', role: 'resident' },
            { id: 1031, email: 'resident_103A@jubileehall.com', password: 'resident@103A', name: 'Madugula Jayaram', role: 'resident' },
            { id: 1032, email: 'resident_103B@jubileehall.com', password: 'resident@103B', name: 'Pratham Singh Chauhan', role: 'resident' },
            { id: 1041, email: 'resident_104A@jubileehall.com', password: 'resident@104A', name: 'Kalilou Couibaly', role: 'resident' },
            { id: 1042, email: 'resident_104B@jubileehall.com', password: 'resident@104B', name: 'Agismaguel Boubacar', role: 'resident' },
            { id: 106, email: 'resident_106@jubileehall.com', password: 'resident@106', name: 'Harsh Chauhan', role: 'resident' },
            { id: 108, email: 'resident_108@jubileehall.com', password: 'resident@108', name: 'Benoy Sabu', role: 'resident' },
            { id: 109, email: 'resident_109@jubileehall.com', password: 'resident@109', name: 'Pradeep R', role: 'resident' },
            { id: 112, email: 'resident_112@jubileehall.com', password: 'resident@112', name: 'Arvind', role: 'resident' },
            { id: 113, email: 'resident_113@jubileehall.com', password: 'resident@113', name: 'Yogesh Tripathi', role: 'resident' },
            { id: 114, email: 'resident_114@jubileehall.com', password: 'resident@114', name: 'Prabhakar ', role: 'resident' },
            { id: 116, email: 'resident_116@jubileehall.com', password: 'resident@116', name: 'Rajkumar', role: 'resident' },
            { id: 119, email: 'resident_119@jubileehall.com', password: 'resident@119', name: 'Naman Manhas', role: 'resident' },
            { id: 120, email: 'resident_120@jubileehall.com', password: 'resident@120', name: 'Rahul Kumar Ray', role: 'resident' },
            { id: 121, email: 'resident_121@jubileehall.com', password: 'resident@121', name: 'Anurag Gautam', role: 'resident' },
            { id: 122, email: 'resident_122@jubileehall.com', password: 'resident@122', name: 'Akash Chahar', role: 'resident' },
            { id: 123, email: 'resident_123@jubileehall.com', password: 'resident@123', name: 'Amit Mandal', role: 'resident' },
            { id: 124, email: 'resident_124@jubileehall.com', password: 'resident@124', name: 'Keshav', role: 'resident' },
            { id: 125, email: 'resident_125@jubileehall.com', password: 'resident@125', name: 'Soumya Ranjan Hota', role: 'resident' },
            { id: 126, email: 'resident_126@jubileehall.com', password: 'resident@126', name: 'Prashant Kumar Bharti', role: 'resident' },
            { id: 127, email: 'resident_127@jubileehall.com', password: 'resident@127', name: 'Kuldeep Upadhyay', role: 'resident' },
            { id: 128, email: 'resident_128@jubileehall.com', password: 'resident@128', name: 'Sajal Patel', role: 'resident' },
            { id: 129, email: 'resident_129@jubileehall.com', password: 'resident@129', name: 'Ranjeet Kumar Sahu', role: 'resident' },
            { id: 130, email: 'resident_130@jubileehall.com', password: 'resident@130', name: 'Jatin Prajapati', role: 'resident' }
        ]);

        // Menu
        const menu = await Menu.create(INITIAL_MENU);

        // Off-days
        const offDays = await OffDay.insertMany([
            { date: new Date('2025-01-01'), reason: 'New Year Holiday' },
            { date: new Date('2025-01-26'), reason: 'Republic Day' },
            { date: new Date('2025-12-22'), reason: 'Aryan Birthday' }
        ]);

        // Sample Booking
        const booking = await Booking.create({
            userId: users[0]._id,
            userName: users[0].name,
            contactNumber: '8957849356',
            mealType: 'lunch',
            date: new Date('2025-05-23'),
            quantities: { 'rice': 2, 'dal': 2, 'sabji': 2, 'roti': 2 },
            hasDiscount: false,
            status: 'pending'
        });

        // Sample Guest Booking
        const guestBooking = await GuestBooking.create({
            id: '1747940243595',
            userName: 'Tanya Shukla',
            contactNumber: '8957849356',
            mealType: 'lunch',
            date: new Date('2025-05-23'),
            quantities: { 'rice': 2, 'dal': 2, 'sabji': 2, 'roti': 2 },
            hasDiscount: true,
            status: 'pending'
        });

        // Sample Rebate
        const rebate = await Rebate.create({
            id: '1747940286490',
            userId: users[0]._id,
            userName: users[0].name,
            startDate: new Date('2025-05-30'),
            endDate: new Date('2025-06-07'),
            reason: 'Going Home',
            status: 'pending'
        });

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

// Include INITIAL_MENU from config or define inline
const INITIAL_MENU = {
    monday: {
        breakfast: ["Lunch Pack: Paratha, Paneer Bhurji", "Bread", "Aloo Sandwich/Grilled Sandwich", "Jam", "Banana/Omelette", "Milk", "Tea"],
        lunch: ["Bhindi Fry", "Rice", "Lal Masoor Dal", "Chapati", "Hari Chutney", "Salad", "Curd Rice"],
        dinner: ["Matar Paneer ", " Egg Curry OR Fish Fry (Alt)", "Rice", "Arhar Dal", "Chapati", "Salad", "Dessert: Rooh-Afza Milk"]
    },
    tuesday: {
        breakfast: ["Lunch Pack: Aloo Matar and Paratha", "Aalu-Pyaaz / Paneer Pyaaz (Alt) Paratha", "Curd", "Tea", "Achaar", "Chutney", "Ketchup"],
        lunch: ["Matar Pattagobhi", "Rice", "Arhar Dal", "Chapati", "Salad", "Chaach"],
        dinner: ["Mix Veg", "Veg Pulao / (Rasam Rice & Papad)", "Rajma", "Chapati", "Salad", "Laal Chutney", "Dessert: Chilled Kheer / Sewai"]
    },
    wednesday: {
        breakfast: ["Lunch Pack: Bhindi Fry, Roti", "Idli", "Coconut-Peanut Chutney", "Sambar", "Mango Shake"],
        lunch: ["Brinjal Masala", "Rice", "Palak Dal", "Chapati", "Salad", "Curd Rice"],
        dinner: ["Kadai Paneer", "Chicken Kadai", "Rice", "Arhar Dal", "Chapati", "Salad", "Dessert: Ice Cream [Vanilla, American nut, Butterscotch]"]
    },
    thursday: {
        breakfast: ["Lunch Pack: Sookhe Chole, Puri", "Gobhi Paratha", "Achaar", "Curd", "Chutney", "Tea"],
        lunch: ["Kadhi Pakora", "Tamatar Pyaaz Curry", "Rice", "Chapati", "Salad", "Rooh-Afza Milk"],
        dinner: ["Mango Pyaaz Curry", "Dal Fry", "Chapati", "Salad", "Tamarind/Lemon Rice", "Dessert: Gulab Jamun"]
    },
    friday: {
        breakfast: ["Lunch Pack: Matar Pattagobhi, Paratha", "Upma Chana", "Tamatar Chutney", "Boiled Egg / Banana", "Daliya", "Chocolate Shake", "Tomato Sauce"],
        lunch: ["Aloo Matar Gobhi Masala Sabji", "Kali Masoor Dal", "Salad", "Rice", "Chapati", "Chhach"],
        dinner: ["Chicken Fry Piece Biryani ", "Paneer Biryani", "Mirchi Ka Salan", "Rajma", "Chapati", "Boondi Raita", "Salad", "Dessert: Cold Drinks"]
    },
    saturday: {
        breakfast: ["Lunch Pack: Aloo Bhujia, Roti", "Sambar Vada", "Coconut-Peanut Chutney", "Fruitchat", "Milk"],
        lunch: ["Khichdi", "Aloo-Chokha", "Lobia", "Dahi", "Papad", "Chapati", "Salad"],
        dinner: ["Aloo Methi / Karela Fry", "Dal Makhni", "Chapati", "Rice", "Tamatar Chutney", "Salad", "Dessert: Badam Shake"]
    },
    sunday: {
        breakfast: ["(Paneer Chilla, Moong-Dal Pakode) / (Dosa Alt)", "Coconut-Peanut Chutney", "Rasam", "Banana Shake"],
        lunch: ["Chhole", "Palak Puri", "Bhature", "Pumpkin", "Rice", "Salad", "Dahi Papdi", "Imli Chutney"],
        dinner: ["Paneer Bhurji ", "Chicken Gravy Roast / Mutton Curry (Alt)", "Chapati", "Tomato Rice", "Moong-Masoor Dal", "Pacchipulusu", "Salad", "Dessert: Shahi Tukda / Double Ka Meetha"]
    }
};

seedData();
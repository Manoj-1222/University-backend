const express = require('express');
const router = express.Router();

// @route   GET /api/university/about
// @desc    Get university information
// @access  Public
router.get('/about', (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Tech University",
      established: "1995",
      location: "Hyderabad, Telangana",
      vision: "To be a leading institution in higher education and research",
      mission: "To provide quality education and foster innovation",
      accreditation: "NAAC Grade A+",
      ranking: "Top 50 Universities in India",
      facilities: [
        "State-of-the-art laboratories",
        "Modern library with digital resources",
        "Sports complex",
        "Hostel facilities",
        "Cafeteria",
        "Medical center"
      ],
      departments: [
        "Computer Science and Engineering",
        "Electronics and Communication Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Business Administration",
        "Arts and Sciences"
      ]
    }
  });
});

// @route   GET /api/university/courses
// @desc    Get available courses
// @access  Public
router.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      undergraduate: [
        {
          name: "B.Tech Computer Science",
          duration: "4 years",
          seats: 120,
          eligibility: "12th with PCM, minimum 75%"
        },
        {
          name: "B.Tech Electronics",
          duration: "4 years", 
          seats: 60,
          eligibility: "12th with PCM, minimum 75%"
        },
        {
          name: "BBA",
          duration: "3 years",
          seats: 80,
          eligibility: "12th any stream, minimum 60%"
        }
      ],
      postgraduate: [
        {
          name: "M.Tech Computer Science",
          duration: "2 years",
          seats: 40,
          eligibility: "B.Tech in relevant field"
        },
        {
          name: "MBA",
          duration: "2 years",
          seats: 60,
          eligibility: "Bachelor's degree with CAT/MAT score"
        }
      ]
    }
  });
});

// @route   GET /api/university/faculty
// @desc    Get faculty information
// @access  Public
router.get('/faculty', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        name: "Dr. Rajesh Kumar",
        department: "Computer Science",
        designation: "Professor & HOD",
        qualification: "Ph.D in Computer Science",
        experience: "15 years",
        specialization: "Data Structures, Algorithms"
      },
      {
        name: "Prof. Anita Sharma", 
        department: "Computer Science",
        designation: "Associate Professor",
        qualification: "Ph.D in Software Engineering",
        experience: "12 years",
        specialization: "Software Engineering, Web Technologies"
      },
      {
        name: "Dr. Vikram Singh",
        department: "Computer Science", 
        designation: "Assistant Professor",
        qualification: "Ph.D in Database Systems",
        experience: "8 years",
        specialization: "Database Management, Data Mining"
      }
    ]
  });
});

// @route   GET /api/university/placements
// @desc    Get placement statistics
// @access  Public
router.get('/placements', (req, res) => {
  res.json({
    success: true,
    data: {
      overallPlacementRate: "95%",
      averagePackage: "8.5 LPA",
      highestPackage: "45 LPA",
      topRecruiters: [
        "TCS", "Infosys", "Wipro", "Accenture", "Microsoft", 
        "Amazon", "Google", "IBM", "Cognizant", "HCL"
      ],
      placementStats: [
        { year: "2024", placed: 450, totalStudents: 480, percentage: 93.75 },
        { year: "2023", placed: 420, totalStudents: 450, percentage: 93.33 },
        { year: "2022", placed: 380, totalStudents: 400, percentage: 95.00 }
      ]
    }
  });
});

// @route   GET /api/university/events
// @desc    Get upcoming events
// @access  Public
router.get('/events', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        title: "Tech Fest 2025",
        date: "2025-03-15",
        description: "Annual technical festival with competitions and workshops",
        venue: "Main Auditorium"
      },
      {
        title: "Placement Drive - TCS",
        date: "2025-02-20",
        description: "Campus recruitment drive by TCS",
        venue: "Placement Cell"
      },
      {
        title: "Guest Lecture on AI",
        date: "2025-02-10",
        description: "Industry expert talk on Artificial Intelligence trends",
        venue: "Computer Science Department"
      }
    ]
  });
});

// @route   GET /api/university/contact
// @desc    Get contact information
// @access  Public
router.get('/contact', (req, res) => {
  res.json({
    success: true,
    data: {
      address: "Tech University, Gachibowli, Hyderabad - 500032, Telangana",
      phone: "+91-40-12345678",
      email: "info@techuniversity.edu.in",
      website: "www.techuniversity.edu.in",
      admissionsOffice: {
        phone: "+91-40-12345679",
        email: "admissions@techuniversity.edu.in",
        timings: "9:00 AM - 5:00 PM (Mon-Fri)"
      },
      placementCell: {
        phone: "+91-40-12345680", 
        email: "placements@techuniversity.edu.in"
      }
    }
  });
});

module.exports = router;

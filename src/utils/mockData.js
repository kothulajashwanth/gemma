// Hyderabad Urban Intelligence Dataset for HYDRA OS

export const MOCK_USER = {
  name: "Jashwanth",
  handle: "@jashu_sentinel",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  score: 94,
  level: "Level 4 Cyber Sentinel",
  rank: "#12 in Hyderabad Central",
  totalScans: 142,
  reportsSubmitted: 28,
  hazardsResolved: 21,
  badges: [
    { id: 1, title: "Pothole Hunter", icon: "Target", desc: "Detected 10+ severe potholes" },
    { id: 2, title: "Storm Watcher", icon: "CloudRain", desc: "First alert for Begumpet flooding" },
    { id: 3, title: "Top Sentinel", icon: "ShieldCheck", desc: "98% AI verification confidence rating" },
    { id: 4, title: "Eco Defender", icon: "Trash2", desc: "Cleaned 5 waste accumulation points" }
  ]
};

export const HYDERABAD_AQI = {
  score: 84,
  status: "Moderate Air",
  pm25: 32,
  pm10: 68,
  co: 0.8,
  no2: 24,
  o3: 42,
  temp: 31,
  feelsLike: 35,
  humidity: 72,
  windSpeed: 14,
  uvIndex: 7,
  heatWarning: "Severe Heat Index: Stay hydrated in Gachibowli & Hitec City zones between 12 PM - 3 PM."
};

export const AI_INSIGHTS = [
  {
    id: 1,
    title: "Heavy Rainfall Alert",
    description: "Convective storm clouds forming over Cyberabad. Expected 45mm rain in 2 hours near Begumpet underpass.",
    time: "2 mins ago",
    severity: "danger",
    dept: "HYDRA Flood Cell"
  },
  {
    id: 2,
    title: "Traffic Flow Optimization",
    description: "AI redirected 1,200 vehicles away from Jubilee Hills Checkpost due to active trenching work.",
    time: "15 mins ago",
    severity: "warning",
    dept: "Cyberabad Traffic Police"
  },
  {
    id: 3,
    title: "Sensors Active: 99.4%",
    description: "3,480 IoT water-level markers & smart cameras online across GHMC 6 zones.",
    time: "1 hour ago",
    severity: "success",
    dept: "HYDRA Command Center"
  }
];

export const MOCK_HAZARDS = [
  {
    id: "HZ-8092",
    title: "Critical Pothole & Trench",
    category: "Pothole",
    location: "Road No. 36, Jubilee Hills, Hyderabad",
    coords: [17.4325, 78.4071],
    severity: "Critical",
    confidence: 97.4,
    status: "In Progress",
    dept: "GHMC Engineering & Works",
    date: "2026-07-25 10:30 AM",
    upvotes: 42,
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    description: "Deep 1.2m wide asphalt rupture presenting extreme hazard to two-wheelers during night hours."
  },
  {
    id: "HZ-8093",
    title: "Water Inundation Risk",
    category: "Flood Water",
    location: "Begumpet Railway Underpass, Hyderabad",
    coords: [17.4436, 78.4611],
    severity: "High",
    confidence: 98.9,
    status: "Assigned",
    dept: "HYDRA Urban Drainage Cell",
    date: "2026-07-25 11:15 AM",
    upvotes: 89,
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    description: "Drainage clogging causing 15cm water buildup. Drainage pumps deployed by HYDRA emergency unit."
  },
  {
    id: "HZ-8094",
    title: "Commercial Waste Accumulation",
    category: "Garbage",
    location: "Inorbit Mall Road, Madhapur, Hyderabad",
    coords: [17.4375, 78.3852],
    severity: "Medium",
    confidence: 94.1,
    status: "Submitted",
    dept: "GHMC Sanitation Division",
    date: "2026-07-25 09:00 AM",
    upvotes: 18,
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    description: "Overflowing municipal dumpster blocking secondary lane and pedestrian sidewalk."
  },
  {
    id: "HZ-8095",
    title: "High Voltage Transformer Arc",
    category: "Broken Street Light",
    location: "Mindspace Circle, Gachibowli, Hyderabad",
    coords: [17.4401, 78.3489],
    severity: "Critical",
    confidence: 99.2,
    status: "In Progress",
    dept: "TSSPDCL Electrical Safety",
    date: "2026-07-25 08:45 AM",
    upvotes: 112,
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    description: "Faulty transformer wire spark near bus stop. TSSPDCL rapid repair team dispatched."
  },
  {
    id: "HZ-8096",
    title: "Flyover Expansion Joint Crack",
    category: "Road Crack",
    location: "Cyber Towers Flyover, Hitec City",
    coords: [17.4504, 78.3808],
    severity: "Medium",
    confidence: 92.7,
    status: "Resolved",
    dept: "HMDA Infrastructure Division",
    date: "2026-07-24 04:20 PM",
    upvotes: 67,
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    description: "Fissure seal re-filled and load tested successfully by structural engineers."
  }
];

export const MOCK_VISION_SAMPLES = [
  {
    id: "sample-1",
    name: "Pothole Detection",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    boxes: [
      { label: "Pothole (Severe)", confidence: 96.8, x: 25, y: 35, width: 45, height: 35, color: "#FF4D6D" },
      { label: "Asphalt Fissure", confidence: 89.2, x: 10, y: 65, width: 30, height: 20, color: "#FFC857" }
    ],
    hazardType: "Pothole",
    severity: "Critical",
    confidence: 96.8,
    dept: "GHMC Road Infrastructure",
    recommendation: "Deploy cold-mix asphalt patch truck within 4 hours. Divert heavy vehicles."
  },
  {
    id: "sample-2",
    name: "Urban Flood Surge",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    boxes: [
      { label: "Water Inundation", confidence: 98.9, x: 15, y: 25, width: 70, height: 60, color: "#00E5FF" }
    ],
    hazardType: "Flood Water",
    severity: "Critical",
    confidence: 98.9,
    dept: "HYDRA Disaster Management",
    recommendation: "Activate storm drain suction unit #4. Issue traffic advisory for Begumpet underpass."
  },
  {
    id: "sample-3",
    name: "Garbage Overflow",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    boxes: [
      { label: "Solid Waste Pile", confidence: 94.5, x: 20, y: 20, width: 55, height: 65, color: "#FFC857" }
    ],
    hazardType: "Garbage",
    severity: "Medium",
    confidence: 94.5,
    dept: "GHMC Sanitation Corps",
    recommendation: "Dispatch compactor vehicle #81 to Madhapur sector."
  },
  {
    id: "sample-4",
    name: "Electrical Grid Spark",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    boxes: [
      { label: "Exposed Conduit", confidence: 97.1, x: 35, y: 15, width: 30, height: 40, color: "#FF4D6D" }
    ],
    hazardType: "Broken Street Light",
    severity: "Critical",
    confidence: 97.1,
    dept: "TSSPDCL Grid Operations",
    recommendation: "Isolate Feeder #12 breaker remotely via HYDRA Smart Grid controller."
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "Emergency",
    title: "HYDRA Flood Alert: Begumpet Zone",
    message: "Heavy convection cloud over Begumpet & Paradise. Avoid low-lying underpasses.",
    time: "10m ago",
    read: false
  },
  {
    id: "notif-2",
    type: "Reports",
    title: "Report HZ-8092 Status Updated",
    message: "GHMC Works Division assigned crew #14 to Jubilee Hills Pothole repair.",
    time: "45m ago",
    read: false
  },
  {
    id: "notif-3",
    type: "Weather",
    title: "High UV Warning Index: 7.8",
    message: "Peak solar radiation predicted between 1 PM - 3:30 PM in Cyberabad.",
    time: "2h ago",
    read: true
  },
  {
    id: "notif-4",
    type: "Government",
    title: "HYDRA OS v4.2 Deployment Complete",
    message: "Real-time AI sensor calibration completed across all 30 GHMC circles.",
    time: "5h ago",
    read: true
  }
];

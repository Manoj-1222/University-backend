// Temporary production environment variables for Vercel deployment
// In production, these should be set in Vercel dashboard, not in code

if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb+srv://gogurlamanoj722:ybeWTEjVmM9Mkhuu@university-project.1kftdns.mongodb.net/University?retryWrites=true&w=majority&appName=University-Project';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'Tech_Mahindra_COE_Project_JWT_Secret_Key_2025_University_Management_System';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('🔧 Environment variables loaded for production deployment');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

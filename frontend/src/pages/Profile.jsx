function Profile() {
    return (
      <div className="min-h-screen bg-[#f6eae2] flex flex-col items-center pt-20">
        <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
          <p className="text-gray-700">Name: John Doe</p>
          <p className="text-gray-700 mt-2">Email: john@example.com</p>
          <p className="text-gray-700 mt-2">Member since: Jan 2024</p>
          <button className="mt-6 bg-black text-white px-4 py-2 rounded">Edit Profile</button>
        </div>
      </div>
    );
  }
  
  export default Profile;
  
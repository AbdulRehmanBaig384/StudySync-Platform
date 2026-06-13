import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PartnerFilters from '../components/PartnerFilters';
import PartnerCard from '../components/PartnerCard';
import PartnerRequestList from '../components/PartnerRequestList';
import PartnerConnections from '../components/PartnerConnections';
import { FiUsers, FiLoader } from 'react-icons/fi';
import { NavLink } from 'react-router';
import { useSocket } from '../context/SocketContext';

const FindPartner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    subject: '',
    department: '',
    semester: '',
    style: '',
    skill: '',
    time: ''
  });

  // useEffect(() => {
  //   const email = localStorage.getItem('userEmail');
  //   if (!email) return;

  //   // Initialize socket
  //   const socket = io(import.meta.env.VITE_API_BASE_URL);
  //   socket.emit('user_online', email);

  //   socket.on('status_change', ({ email: changedEmail, status }) => {
  //     setPartners(prev => prev.map(p => 
  //       p.email === changedEmail ? { ...p, onlineStatus: status } : p
  //     ));
  //   });

  //   const fetchData = async () => {
  //     try {
  //       // Get user profile first to get their department/subjects
  //       const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile?email=${email}`);
  //       const profileData = await profileRes.json();

  //       if (profileRes.ok) {
  //         setUserProfile(profileData);
  //         setFilters(prev => ({ ...prev, department: profileData.department }));

  //         // Fetch partners based on user profile
  //         const partnersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/partners?email=${email}&department=${profileData.department}&facultyOfStudy=${profileData.facultyOfStudy}&preferredSubjects=${profileData.Preferred_Subjects.join(',')}`);
  //         const partnersData = await partnersRes.json();

  //         if (partnersRes.ok) {
  //           setPartners(partnersData);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile?email=${email}`);
        const profileData = await profileRes.json();

        if (profileRes.ok) {
          setUserProfile(profileData);
          setFilters(prev => ({ ...prev, department: profileData.department }));

          const subjectsParam = (profileData.Preferred_Subjects || [])
            .map(s => `preferredSubjects=${encodeURIComponent(s)}`)
            .join('&');

          const partnersRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/partners?userId=${userId || profileData._id}&department=${encodeURIComponent(profileData.department)}&facultyOfStudy=${encodeURIComponent(profileData.facultyOfStudy)}&${subjectsParam}`
          );
          const partnersData = await partnersRes.json();

          if (partnersRes.ok) {
            setPartners(partnersData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update partners list when onlineUsers change in context
  useEffect(() => {
    if (Object.keys(onlineUsers).length > 0) {
      setPartners(prev => prev.map(p => 
        onlineUsers[p.email] ? { ...p, onlineStatus: onlineUsers[p.email] } : p
      ));
    }
  }, [onlineUsers]);

  // const handleFilterChange = async (newFilters) => {
  //   setFilters(newFilters);
  //   setLoading(true);
  //   try {
  //     const email = localStorage.getItem('userEmail');
  //     const subjectsParam = (newFilters.subject
  //       ? [newFilters.subject]
  //       : userProfile?.Preferred_Subjects || []
  //     ).map(s => `preferredSubjects=${encodeURIComponent(s)}`).join('&');

  //     const partnersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/partners?email=${email}&department=${newFilters.department || userProfile?.department}&facultyOfStudy=${newFilters.facultyOfStudy || userProfile?.facultyOfStudy}&preferredSubjects=${newFilters.subject || userProfile?.Preferred_Subjects.join(',')}&semester=${newFilters.semester}`);
  //     const partnersData = await partnersRes.json();
  //     if (partnersRes.ok) {
  //       setPartners(partnersData);
  //     }
  //   } catch (error) {
  //     console.error("Error filtering partners:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');

      const subjectsParam = (newFilters.subject
        ? [newFilters.subject]
        : userProfile?.Preferred_Subjects || []
      ).map(s => `preferredSubjects=${encodeURIComponent(s)}`).join('&');

      const partnersRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/partners?userId=${userId || userProfile?._id}&department=${encodeURIComponent(newFilters.department || userProfile?.department || '')}&facultyOfStudy=${encodeURIComponent(newFilters.facultyOfStudy || userProfile?.facultyOfStudy || '')}&${subjectsParam}&semester=${newFilters.semester || ''}`
      );

      const partnersData = await partnersRes.json();
      if (partnersRes.ok) {
        setPartners(partnersData);
      }
    } catch (error) {
      console.error("Error filtering partners:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-black text-white mb-2 font-jakarta tracking-tight">
            Find <span className="text-gradient font-black">Study Partner</span> 🤝
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-8 h-px bg-indigo-500/30"></span>
            Discover students with matching study styles
          </p>
        </div>
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3">
            <FiUsers className="text-lg" />
            My Partners
          </button>
        </div>
      </div>

      {/* Discovery Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="xl:col-span-3 space-y-8">
          <PartnerFilters onFilterChange={handleFilterChange} initialFilters={filters} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <FiLoader className="text-4xl text-indigo-500 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Finding matches...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <PartnerCard
                    key={partner._id}
                    id={partner._id}
                    name={`${partner.Firstname} ${partner.lastname}`}
                    department={partner.department}
                    facultyOfStudy={partner.facultyOfStudy}
                    semester={partner.Year_of_Study}
                    subjects={partner.Preferred_Subjects}
                    style={partner.Preferred_Study_Time}
                    availability={partner.Preferred_Study_Time}
                    compatibility={partner.matchScore * 30 + 10} // Simple visualization
                    matchLevel={partner.matchLevel}
                    onlineStatus={partner.onlineStatus}
                    avatar={partner.Firstname.charAt(0) + partner.lastname.charAt(0)}
                    onInvite={() => {
                      setPartners(prev => prev.filter(p => p._id !== partner._id));
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white/5 border border-white/5 rounded-[2rem] p-12 text-center animate-slide-up">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <FiUsers className="text-slate-500 text-2xl" />
                  </div>
                  <p className="text-slate-400 font-bold mb-2">No partners found matching your criteria.</p>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">
                    {!userProfile?.department
                      ? "Make sure you have set your department in your profile!"
                      : `Only users in the "${userProfile.department}" department with completed profiles will appear here.`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Load More/Status */}
          {!loading && partners.length > 0 && (
            <div className="pt-12 pb-20 flex justify-center">
              <button className="bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                Show more potential matches
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Interactions */}
        <div className="space-y-8">
          <PartnerRequestList />
          <PartnerConnections />

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-2xl shadow-indigo-600/20 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <h4 className="text-white font-black text-xl mb-4 relative z-10 font-jakarta leading-tight">Pro Tip: Fill your Profile!</h4>
            <p className="text-indigo-100/70 text-sm font-medium mb-6 relative z-10 leading-relaxed">Students with complete profiles get 4x more partner requests.</p>
            <button className="w-full bg-white text-indigo-700 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all relative z-10 shadow-lg">
              <NavLink to={'/StudentProfile'}> Update Profile </NavLink>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindPartner;

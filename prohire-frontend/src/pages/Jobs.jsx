import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  fetchAllJobs,
  fetchJobsByProfessional,
  fetchCategories,
  createJob,
  updateJob,
  deleteJob,
} from '../api';

export default function Jobs() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    budget: '',
    deadline: '',
    category: '',
    status: 'open',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobs, cats] = await Promise.all([fetchAllJobs(), fetchCategories()]);
      setAllJobs(jobs);
      setCategories(cats || []);

      if (user?.role === 'professional') {
        try {
          const professional = await fetch(`/api/professionals?userId=${user.id}`).then((r) => r.json());
          if (professional && professional.length > 0) {
            const proJobs = await fetchJobsByProfessional(professional[0].id);
            setMyJobs(proJobs);
          }
        } catch (err) {
          console.error('Error fetching professional jobs:', err);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }

    try {
      setLoading(true);
      if (editingJob) {
        await updateJob(editingJob.id, formData);
        setSuccess('Job updated successfully!');
      } else {
        await createJob(formData);
        setSuccess('Job created successfully!');
      }

      setFormData({
        title: '',
        description: '',
        skills: [],
        budget: '',
        deadline: '',
        category: '',
        status: 'open',
      });
      setShowForm(false);
      setEditingJob(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      setError('');
      await deleteJob(jobId);
      setSuccess('Job deleted successfully!');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      skills: job.skills || [],
      budget: job.budget,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      category: job.category,
      status: job.status,
    });
    setShowForm(true);
  };

  const skillOptions = categories.filter((cat) => ['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'UI Design', 'UX Design', 'Figma', 'SEO', 'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'GraphQL', 'REST API', 'PostgreSQL', 'C++'].includes(cat.name));

  const isProfessional = user?.role === 'professional';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-100 py-4 sm:py-8 px-4 sm:px-6 relative overflow-hidden animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg">💼 Jobs</h1>
          {isProfessional && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingJob(null);
                setFormData({
                  title: '',
                  description: '',
                  skills: [],
                  budget: '',
                  deadline: '',
                  category: '',
                  status: 'open',
                });
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold"
            >
              {showForm ? '❌ Cancel' : '➕ Post Job'}
            </button>
          )}
        </div>

        {error && <div className="mb-6 p-6 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-lg font-semibold animate-fade-in">{error}</div>}
        {success && <div className="mb-6 p-6 bg-green-100 border border-green-400 text-green-700 rounded-2xl text-lg font-semibold animate-fade-in">{success}</div>}

        {isProfessional && showForm && (
          <div className="card backdrop-blur bg-white/70 shadow-2xl rounded-3xl mb-12 p-12">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent animate-slide-up">{editingJob ? 'Edit Job' : '📤 Post New Job'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-4 text-gray-700">📌 Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Build Modern E-Commerce Platform"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 backdrop-blur-sm hover:shadow-xl transition-all text-lg"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-lg font-semibold mb-4 text-gray-700">📝 Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the project requirements, deliverables, and expectations..."
                  rows="4"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-400/50 backdrop-blur-sm hover:shadow-xl transition-all resize-vertical text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 text-gray-700">💰 Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="5000"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-400/50 text-right text-2xl font-bold"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 text-gray-700">📅 Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-400/50 backdrop-blur-sm"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-lg font-semibold mb-4 text-gray-700">🏷️ Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, Mobile App"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-400/50 text-lg"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-lg font-semibold mb-6 text-gray-700">🛠️ Required Skills</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skillOptions.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-glow cursor-pointer transition-all hover:bg-green-50 group">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill.name)}
                        onChange={() => handleSkillToggle(skill.name)}
                        className="w-6 h-6 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-lg font-semibold group-hover:text-green-700 transition">{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 flex gap-6 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Saving...' : editingJob ? '✏️ Update Job' : '🚀 Post Job'}
                </button>
                {editingJob && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJob(null);
                      setShowForm(false);
                      setFormData({
                        title: '',
                        description: '',
                        skills: [],
                        budget: '',
                        deadline: '',
                        category: '',
                        status: 'open',
                      });
                    }}
                    className="px-8 py-5 bg-gray-400 text-white rounded-2xl text-xl font-bold hover:bg-gray-500 shadow-lg hover:shadow-xl transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {isProfessional && myJobs.length > 0 && (
          <div className="card backdrop-blur bg-white/70 shadow-2xl rounded-3xl mb-12 p-12">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-slide-up">📋 My Posted Jobs ({myJobs.length})</h2>
            <div className="space-y-6">
              {myJobs.map((job) => (
                <div key={job.id} className="backdrop-blur bg-white/80 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-102 transition-all border border-orange-200 group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600">{job.title}</h3>
                      <p className="text-gray-600 mt-4 text-lg leading-relaxed">{job.description}</p>
                      <div className="mt-6 flex gap-3 flex-wrap">
                        {job.skills?.map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-glow transition-all">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-4 text-sm font-semibold">
                        <div className="text-center p-4 bg-orange-50 rounded-2xl">
                          <p className="text-2xl text-orange-600">💰 {job.budget}</p>
                          <p>Budget</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-2xl">
                          <p className="text-xl capitalize text-blue-700 font-bold">{job.status}</p>
                          <p>Status</p>
                        </div>
                        {job.deadline && (
                          <div className="text-center p-4 bg-purple-50 rounded-2xl">
                            <p className="text-lg text-purple-700">{new Date(job.deadline).toLocaleDateString()}</p>
                            <p>Deadline</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleEdit(job)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 shadow-lg hover:shadow-glow transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 shadow-lg transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card backdrop-blur bg-white/80 shadow-2xl rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent animate-slide-up">🔍 Available Jobs ({allJobs.length})</h2>
          {allJobs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl text-gray-400 mb-6 animate-pulse">No jobs available yet</p>
              <p className="text-xl text-gray-500">Be the first to post or check back soon! 🚀</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allJobs.map((job) => (
                <div key={job.id} className="backdrop-blur bg-white/70 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-102 transition-all border border-blue-200 group">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 mb-4">{job.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">{job.description}</p>
                      <div className="flex gap-3 flex-wrap mb-8">
                        {job.skills?.map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-glow transition-all">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-2xl">
                          <p className="text-2xl font-bold text-blue-700">💰 {job.budget}</p>
                          <p className="text-sm text-gray-600 mt-1">Budget</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-2xl">
                          <p className="text-lg font-bold capitalize text-green-700">{job.category}</p>
                          <p className="text-sm text-gray-600 mt-1">Category</p>
                        </div>
                        {job.deadline && (
                          <div className="text-center p-4 bg-purple-50 rounded-2xl">
                            <p className="text-lg text-purple-700">{new Date(job.deadline).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600 mt-1">Deadline</p>
                          </div>
                        )}
                        <div className="text-center p-4 bg-indigo-50 rounded-2xl md:col-span-2 lg:col-auto">
                          <p className="font-bold text-blue-700 text-lg">By: {job.professional?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600 mt-1">Posted by</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

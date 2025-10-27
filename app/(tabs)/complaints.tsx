import { useState, useRef } from "react";

const Ionicons = ({ name, size, color }) => {
  const iconMap = {
    "arrow-back": "←",
    "document-text-outline": "📄",
    "camera-outline": "📷",
    "location-outline": "📍",
    "person-outline": "👤",
    "call-outline": "📞",
    "mail-outline": "✉️",
    "send": "➤",
    "time-outline": "🕐",
    "checkmark-circle": "✓",
    "alert-circle-outline": "⚠️"
  };
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>
      {iconMap[name] || "•"}
    </span>
  );
};

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    category: "",
    customCategory: "",
    description: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    setSelectedFiles(validFiles);
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const categories = [
    { id: 1, name: "Road Issues", icon: "🚧", color: "#FF6B6B" },
    { id: 2, name: "Garbage", icon: "🗑️", color: "#4ECDC4" },
    { id: 3, name: "Water Supply", icon: "💧", color: "#45B7D1" },
    { id: 4, name: "Electricity", icon: "⚡", color: "#F7B731" },
    { id: 5, name: "Street Lights", icon: "💡", color: "#5F27CD" },
    { id: 6, name: "Fire", icon: "🔥", color: "#E74C3C" },
    { id: 7, name: "Flood", icon: "🌊", color: "#3498DB" },
    { id: 8, name: "Crime/Safety", icon: "🚨", color: "#E67E22" },
    { id: 9, name: "Noise Complaint", icon: "🔊", color: "#9B59B6" },
    { id: 10, name: "Illegal Dumping", icon: "♻️", color: "#27AE60" },
    { id: 11, name: "Damaged Infrastructure", icon: "🏗️", color: "#E67E22" },
    { id: 12, name: "Animal Control", icon: "🐕", color: "#F39C12" },
    { id: 13, name: "Drainage Issues", icon: "🚰", color: "#16A085" },
    { id: 14, name: "Traffic Violation", icon: "🚦", color: "#C0392B" },
    { id: 15, name: "Others", icon: "📋", color: "#95A5A6" },
  ];

  const handleSubmit = () => {
    // Validation
    const errors = [];
    
    if (!selectedCategory) {
      errors.push("Please select a complaint category");
    }
    
    if (selectedCategory === 15 && !formData.customCategory.trim()) {
      errors.push("Please specify your complaint type");
    }
    
    if (!formData.name.trim()) {
      errors.push("Please enter your full name");
    }
    
    if (!formData.contact.trim()) {
      errors.push("Please enter your contact number");
    }
    
    if (!formData.location.trim()) {
      errors.push("Please enter the location");
    }
    
    if (!formData.description.trim()) {
      errors.push("Please provide a description of your complaint");
    }
    if (selectedFiles.length === 0) {
      errors.push("Please upload at least one photo as proof");
    }
    
    // Show errors if any
    if (errors.length > 0) {
      alert("Please complete the following:\n\n" + errors.map((err, i) => `${i + 1}. ${err}`).join("\n"));
      return;
    }
    
    // Create new complaint
    const newComplaint = {
      id: Date.now(),
      title: selectedCategory === 15 ? formData.customCategory : formData.category,
      status: "Pending",
      date: "Just now",
      location: formData.location,
      description: formData.description
    };
    
    // Add to recent complaints at the beginning
    setRecentComplaints([newComplaint, ...recentComplaints]);
    
    // Submit successful
    console.log("Form submitted:", formData);
    console.log("Files:", selectedFiles);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds and reset form
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        contact: "",
        email: "",
        location: "",
        category: "",
        customCategory: "",
        description: "",
      });
      setSelectedCategory(null);
      setSelectedFiles([]);
    }, 3000);
  };

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headercon}>
          <button style={styles.backButton}
          onClick={() => window.history.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </button>
          <h1 style={styles.headerText}>File a Complaint</h1>
        </div>

        {/* Success Message Overlay */}
        {showSuccess && (
          <div style={styles.successOverlay}>
            <div style={styles.successCard}>
              <div style={styles.successIcon}>✅</div>
              <h2 style={styles.successTitle}>Complaint Submitted!</h2>
              <p style={styles.successMessage}>
                Your complaint has been successfully submitted. We'll get back to you soon.
              </p>
            </div>
          </div>
        )}

        <div style={styles.scrollContent}>
          {/* Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>
              <Ionicons name="alert-circle-outline" size={28} color="#4A90E2" />
            </div>
            <div style={styles.infoContent}>
              <h3 style={styles.infoTitle}>How it works</h3>
              <p style={styles.infoText}>
                Submit your complaint and we'll assign it to the relevant department. Track your complaint status in real-time.
              </p>
            </div>
          </div>

          {/* Category Selection */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Select Category</h2>
            <div style={styles.categoryGrid}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    ...styles.categoryCard,
                    borderColor: selectedCategory === category.id ? category.color : "#E0E0E0",
                    backgroundColor: selectedCategory === category.id ? `${category.color}15` : "white",
                  }}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setFormData({ ...formData, category: category.name, customCategory: "" });
                  }}
                >
                  <div style={styles.categoryIcon}>{category.icon}</div>
                  <p style={styles.categoryName}>{category.name}</p>
                </div>
              ))}
            </div>
            
            {/* Custom Category Input for "Others" */}
            {selectedCategory === 15 && (
              <div style={styles.customCategoryContainer}>
                <label style={styles.label}>
                  <Ionicons name="document-text-outline" size={18} color="#666" />
                  <span style={styles.labelText}>Specify Complaint Type *</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Please specify your complaint type..."
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Form Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Your Information</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Ionicons name="person-outline" size={18} color="#666" />
                <span style={styles.labelText}>Full Name *</span>
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>
                  <Ionicons name="call-outline" size={18} color="#666" />
                  <span style={styles.labelText}>Contact *</span>
                </label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="09XX XXX XXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>
                  <Ionicons name="mail-outline" size={18} color="#666" />
                  <span style={styles.labelText}>Email</span>
                </label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Ionicons name="location-outline" size={18} color="#666" />
                <span style={styles.labelText}>Exact Location *</span>
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Street, Purok, Barangay, City"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Complaint Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Complaint Details</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Ionicons name="document-text-outline" size={18} color="#666" />
                <span style={styles.labelText}>Description *</span>
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Please describe your complaint in detail..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={styles.uploadSection}>
              <div style={styles.uploadBox}>
                <Ionicons name="camera-outline" size={32} color="#999" />
                <p style={styles.uploadText}>Upload Photos (Proof)</p>
                <p style={styles.uploadSubtext}>JPG, PNG - Max 5MB</p>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <button 
                  style={styles.uploadButton} 
                  type="button"
                  onClick={handleChooseFiles}
                >
                  Choose Files
                </button>
                
                {/* Display selected files */}
                {selectedFiles.length > 0 && (
                  <div style={styles.selectedFilesContainer}>
                    <p style={styles.selectedFilesText}>
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                    </p>
                    <div style={styles.fileList}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} style={styles.fileItem}>
                          <span style={styles.fileName}>📎 {file.name}</span>
                          <button
                            style={styles.removeFileButton}
                            onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button style={styles.submitButton} onClick={handleSubmit}>
            <span style={styles.submitText}>Submit Complaint</span>
            <Ionicons name="send" size={20} color="white" />
          </button>

          {/* Recent Complaints */}
          {recentComplaints.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Your Recent Complaints</h2>
              <div style={styles.recentList}>
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} style={styles.recentItem}>
                    <div style={styles.recentIcon}>
                      <Ionicons name="document-text-outline" size={20} color="#666" />
                    </div>
                    <div style={styles.recentContent}>
                      <p style={styles.recentTitle}>{complaint.title}</p>
                      <div style={styles.recentFooter}>
                        <span style={styles.recentDate}>
                          <Ionicons name="time-outline" size={14} color="#999" />
                          {complaint.date}
                        </span>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: complaint.status === "Resolved" ? "#D4EDDA" : 
                                            complaint.status === "In Progress" ? "#FFF3CD" : "#F8D7DA",
                            color: complaint.status === "Resolved" ? "#155724" : 
                                  complaint.status === "In Progress" ? "#856404" : "#721C24",
                          }}
                        >
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                    <button style={styles.viewButton}>View</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  safeArea: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#F5F7FA",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    position: "relative",
  },
  headercon: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderBottom: "1px solid #E0E0E0",
    flexShrink: 0,
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    marginRight: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  scrollContent: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px 20px",
  },
  successOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  successCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: "40px 32px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "slideIn 0.3s ease-out",
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 12px 0",
  },
  successMessage: {
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 1.6,
    margin: 0,
  },
  infoCard: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    padding: 20,
    backgroundColor: "#EBF5FF",
    borderRadius: 16,
    border: "1px solid #B3D9FF",
    marginBottom: 28,
  },
  infoIcon: {
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 6px 0",
  },
  infoText: {
    fontSize: 14,
    color: "#4A5568",
    margin: 0,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 12,
    maxHeight: "400px",
    overflowY: "auto",
    padding: "4px",
  },
  categoryCard: {
    padding: 20,
    borderRadius: 16,
    border: "2px solid #E0E0E0",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  customCategoryContainer: {
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    border: "2px solid #E0E0E0",
    borderRadius: 12,
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    border: "2px solid #E0E0E0",
    borderRadius: 12,
    outline: "none",
    transition: "border-color 0.3s ease",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  uploadSection: {
    marginTop: 16,
  },
  uploadBox: {
    padding: 40,
    border: "2px dashed #CBD5E0",
    borderRadius: 16,
    textAlign: "center",
    backgroundColor: "#F7FAFC",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    margin: "12px 0 4px",
  },
  uploadSubtext: {
    fontSize: 13,
    color: "#999",
    margin: "0 0 16px",
  },
  uploadButton: {
    padding: "10px 24px",
    backgroundColor: "white",
    border: "2px solid #E0E0E0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  selectedFilesContainer: {
    marginTop: 16,
  },
  selectedFilesText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    backgroundColor: "white",
    borderRadius: 8,
    border: "1px solid #E0E0E0",
  },
  fileName: {
    fontSize: 13,
    color: "#333",
  },
  removeFileButton: {
    background: "none",
    border: "none",
    color: "#E74C3C",
    fontSize: 18,
    cursor: "pointer",
    padding: "0 8px",
  },
  submitButton: {
    width: "100%",
    padding: 18,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: 16,
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
    transition: "transform 0.2s ease",
  },
  submitText: {
    fontSize: 16,
  },
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 6px 0",
  },
  recentFooter: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  recentDate: {
    fontSize: 13,
    color: "#999",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    padding: "8px 16px",
    backgroundColor: "white",
    border: "2px solid #E0E0E0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    cursor: "pointer",
    flexShrink: 0,
  },
};

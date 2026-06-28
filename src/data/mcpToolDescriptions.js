/** Human-readable descriptions for simulated MCP tools. */

export const mcpToolDescriptions = {
  // Udemy
  search_courses: 'Search your organization’s course catalog by keyword, topic, or skill.',
  get_course_curriculum: 'Fetch sections, lectures, and labs for a specific enrolled course.',
  search_lectures: 'Find individual video lectures across your enrolled courses.',
  search_labs: 'Locate hands-on coding labs and practice exercises.',
  get_lecture_progress: 'Read watch time and completion status for a single lecture.',
  list_enrollments: 'List every course the learner is currently enrolled in.',
  get_certificate: 'Retrieve or verify a course completion certificate.',
  create_learning_path: 'Generate an AI-curated sequence of courses toward a learning goal.',
  update_learning_path: 'Reorder or replace courses in an existing learning path.',
  search_instructors: 'Look up instructors and the courses they publish.',
  get_course_reviews: 'Read star ratings and learner reviews for a course.',
  sync_progress: 'Pull the latest lecture-level progress snapshot into Cadence.',

  // Coursera
  get_progress: 'Get completion percentage, status, and last-activity for a course.',
  search_catalog: 'Search courses, specializations, and degrees in your org catalog.',
  list_programs: 'List degree programs and professional certificates you’re enrolled in.',
  get_module_status: 'See which modules, weeks, and items are complete or in progress.',
  get_assignment_grades: 'Fetch grades for quizzes, projects, and peer-reviewed work.',
  search_specializations: 'Find multi-course specialization and certificate tracks.',
  get_peer_reviews: 'Retrieve peer feedback submitted on your assignments.',
  sync_enrollment_report: 'Bulk-sync enrollments and progress from the partner reporting API.',
  get_learning_path: 'Get the recommended next courses in a program or specialization.',
  list_discussions: 'Read forum threads and discussion prompts for a course.',

  // Skillshare (demo)
  list_saved_classes: 'List classes you’ve saved or bookmarked for later.',
  get_watch_progress: 'Read how far you’ve watched in a saved class (demo).',
  search_classes: 'Search creative classes by topic, medium, or teacher.',
  list_workshops: 'List live or scheduled workshops in your Teams account.',
  get_project_submissions: 'Fetch uploaded class projects and creative submissions.',
  list_channels: 'Browse curated class channels and collections.',
  get_class_notes: 'Retrieve timestamped notes taken during a class.',
  sync_watchlist: 'Sync your watchlist into Cadence as in-progress courses.',
  get_teacher_follows: 'List teachers you follow and their latest classes.',
  list_downloads: 'List offline downloads available on your account.',

  // YouTube
  list_playlists: 'List playlists on your account, including learning collections.',
  list_playlist_items: 'Get every video in a playlist with order and metadata.',
  search_education_channels: 'Find channels focused on tutorials and structured learning.',
  get_channel_subscriptions: 'List channels you subscribe to for new content alerts.',
  search_playlists: 'Search your playlists by title or topic keyword.',
  get_video_metadata: 'Fetch title, duration, description, and thumbnails for a video.',
  list_liked_videos: 'List videos you’ve liked that may be learning-related.',
  sync_playlist_progress: 'Estimate progress through a playlist based on watched items.',
  get_playlist_duration: 'Calculate total runtime for a playlist or course series.',
  search_tutorials: 'Search YouTube for tutorial videos matching a skill or topic.',
  list_course_playlists: 'Surface playlists tagged or organized as full courses.',
  get_captions_index: 'List available caption tracks for accessibility and search.',
};

export function getToolDescription(toolId) {
  return (
    mcpToolDescriptions[toolId] ??
    `MCP tool that exposes ${toolId.replaceAll('_', ' ')} data from this platform.`
  );
}

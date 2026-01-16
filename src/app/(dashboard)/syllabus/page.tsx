/**
 * Syllabus Management Page
 * Track courses, topics, and progress
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { Card, Button, Input, Badge, Modal, Progress } from '@/components/ui';
import { cn, formatSmartDate } from '@/lib/utils';
import { Syllabus, SyllabusTopic } from '@/types';

// Mock data
const mockSyllabi: (Syllabus & { topics: SyllabusTopic[] })[] = [
  {
    id: '1',
    userId: '1',
    subjectId: '1',
    title: 'Calculus II',
    description: 'Integration techniques, series, and applications',
    topics: [
      {
        id: '1-1',
        syllabusId: '1',
        title: 'Integration by Parts',
        description: 'Learn integration by parts technique',
        order: 1,
        estimatedHours: 4,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(Date.now() - 604800000),
        isCompleted: true,
        notes: '',
      },
      {
        id: '1-2',
        syllabusId: '1',
        title: 'Trigonometric Substitution',
        description: 'Use trig identities for integration',
        order: 2,
        estimatedHours: 5,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(Date.now() - 259200000),
        isCompleted: true,
        notes: '',
      },
      {
        id: '1-3',
        syllabusId: '1',
        title: 'Partial Fractions',
        description: 'Decompose rational functions',
        order: 3,
        estimatedHours: 4,
        priority: 'medium',
        status: 'not-started',
        completedAt: null,
        isCompleted: false,
        notes: '',
      },
      {
        id: '1-4',
        syllabusId: '1',
        title: 'Sequences and Series',
        description: 'Convergence tests and power series',
        order: 4,
        estimatedHours: 8,
        priority: 'medium',
        status: 'not-started',
        completedAt: null,
        isCompleted: false,
        notes: '',
      },
    ],
    totalTopics: 4,
    completedTopics: 2,
    createdAt: new Date(Date.now() - 1209600000),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    subjectId: '2',
    title: 'Physics 101',
    description: 'Classical mechanics and thermodynamics',
    topics: [
      {
        id: '2-1',
        syllabusId: '2',
        title: 'Kinematics',
        description: 'Motion in 1D and 2D',
        order: 1,
        estimatedHours: 6,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        isCompleted: true,
        notes: '',
      },
      {
        id: '2-2',
        syllabusId: '2',
        title: "Newton's Laws",
        description: 'Forces and motion',
        order: 2,
        estimatedHours: 8,
        priority: 'high',
        status: 'not-started',
        completedAt: null,
        isCompleted: false,
        notes: '',
      },
      {
        id: '2-3',
        syllabusId: '2',
        title: 'Work and Energy',
        description: 'Energy conservation principles',
        order: 3,
        estimatedHours: 6,
        priority: 'medium',
        status: 'not-started',
        completedAt: null,
        isCompleted: false,
        notes: '',
      },
    ],
    totalTopics: 3,
    completedTopics: 1,
    createdAt: new Date(Date.now() - 864000000),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    subjectId: '3',
    title: 'Data Structures',
    description: 'Fundamental data structures and algorithms',
    topics: [
      {
        id: '3-1',
        syllabusId: '3',
        title: 'Arrays and Linked Lists',
        description: 'Linear data structures',
        order: 1,
        estimatedHours: 4,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        isCompleted: true,
        notes: '',
      },
      {
        id: '3-2',
        syllabusId: '3',
        title: 'Stacks and Queues',
        description: 'LIFO and FIFO structures',
        order: 2,
        estimatedHours: 3,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        isCompleted: true,
        notes: '',
      },
      {
        id: '3-3',
        syllabusId: '3',
        title: 'Trees and Graphs',
        description: 'Non-linear data structures',
        order: 3,
        estimatedHours: 10,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        isCompleted: true,
        notes: '',
      },
      {
        id: '3-4',
        syllabusId: '3',
        title: 'Hash Tables',
        description: 'Key-value storage',
        order: 4,
        estimatedHours: 4,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        isCompleted: true,
        notes: '',
      },
    ],
    totalTopics: 4,
    completedTopics: 4,
    createdAt: new Date(Date.now() - 2592000000),
    updatedAt: new Date(),
  },
];

export default function SyllabusPage() {
  const [syllabi, setSyllabi] = useState(mockSyllabi);
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>('1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculate overall progress
  const totalTopics = syllabi.reduce((sum, s) => sum + s.totalTopics, 0);
  const completedTopics = syllabi.reduce((sum, s) => sum + s.completedTopics, 0);
  const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Toggle topic completion
  const toggleTopicCompletion = (syllabusId: string, topicId: string) => {
    setSyllabi((prev) =>
      prev.map((syllabus) => {
        if (syllabus.id !== syllabusId) return syllabus;
        
        const updatedTopics = syllabus.topics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                isCompleted: !topic.isCompleted,
                completedAt: !topic.isCompleted ? new Date() : null,
              }
            : topic
        );

        const completedCount = updatedTopics.filter((t) => t.isCompleted).length;

        return {
          ...syllabus,
          topics: updatedTopics,
          completedTopics: completedCount,
        };
      })
    );
  };

  // Get progress color based on percentage
  const getProgressColor = (progress: number): string => {
    if (progress === 100) return 'from-neon-green to-neon-cyan';
    if (progress >= 75) return 'from-neon-cyan to-neon-blue';
    if (progress >= 50) return 'from-neon-yellow to-neon-green';
    if (progress >= 25) return 'from-neon-orange to-neon-yellow';
    return 'from-neon-pink to-neon-purple';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Syllabus</h1>
          <p className="text-gray-400 mt-1">
            {syllabi.length} courses • {completedTopics}/{totalTopics} topics completed
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Course
        </Button>
      </motion.div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glow" glowColor="purple" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
                <AcademicCapIcon className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <p className="text-sm text-gray-400">Across all courses</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{Math.round(overallProgress)}%</p>
              <p className="text-sm text-gray-400">{completedTopics} of {totalTopics} topics</p>
            </div>
          </div>
          <Progress
            value={overallProgress}
            max={100}
            variant="gradient"
            size="lg"
            showLabel={false}
          />
        </Card>
      </motion.div>

      {/* Syllabi list */}
      <div className="space-y-4">
        {syllabi.map((syllabus, index) => {
          const progress = (syllabus.completedTopics / syllabus.totalTopics) * 100;
          const isExpanded = expandedSyllabus === syllabus.id;

          return (
            <motion.div
              key={syllabus.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="overflow-hidden">
                {/* Syllabus header */}
                <button
                  className="w-full p-4 flex items-center gap-4 hover:bg-dark-700/30 transition-colors"
                  onClick={() => setExpandedSyllabus(isExpanded ? null : syllabus.id)}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </motion.div>

                  <div className="p-2 rounded-xl bg-dark-700/50">
                    <BookOpenIcon className="w-6 h-6 text-neon-cyan" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white">{syllabus.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {syllabus.description}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {syllabus.completedTopics}/{syllabus.totalTopics}
                      </p>
                      <p className="text-xs text-gray-400">topics</p>
                    </div>
                    <div className="w-32">
                      <Progress
                        value={progress}
                        max={100}
                        variant="gradient"
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>

                  {progress === 100 && (
                    <Badge variant="green">
                      <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                      Complete
                    </Badge>
                  )}
                </button>

                {/* Topics list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-dark-600/50"
                    >
                      <div className="p-4 space-y-2">
                        {syllabus.topics.map((topic, topicIndex) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: topicIndex * 0.05 }}
                            className={cn(
                              'flex items-center gap-4 p-3 rounded-xl transition-colors',
                              topic.isCompleted
                                ? 'bg-neon-green/5 border border-neon-green/20'
                                : 'bg-dark-700/30 hover:bg-dark-700/50'
                            )}
                          >
                            <button
                              onClick={() => toggleTopicCompletion(syllabus.id, topic.id)}
                              className="flex-shrink-0"
                            >
                              {topic.isCompleted ? (
                                <CheckCircleSolidIcon className="w-6 h-6 text-neon-green" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-500 hover:border-neon-green transition-colors" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <h4
                                className={cn(
                                  'font-medium',
                                  topic.isCompleted ? 'text-gray-400 line-through' : 'text-white'
                                )}
                              >
                                {topic.title}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {topic.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1 text-gray-400">
                                <ClockIcon className="w-4 h-4" />
                                <span>{topic.estimatedHours}h</span>
                              </div>
                              {topic.completedAt && (
                                <span className="text-xs text-gray-500">
                                  {formatSmartDate(topic.completedAt)}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* Add topic button */}
                        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-dark-500 hover:border-neon-cyan/50 hover:bg-dark-700/30 transition-colors text-gray-400 hover:text-neon-cyan">
                          <PlusIcon className="w-5 h-5" />
                          <span>Add Topic</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {syllabi.length === 0 && (
        <Card className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
            <AcademicCapIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No syllabi yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create your first syllabus to start tracking your learning progress
          </p>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<PlusIcon className="w-5 h-5" />}
          >
            Add Course
          </Button>
        </Card>
      )}

      {/* Add syllabus modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Course"
        description="Create a new syllabus to track your progress"
      >
        <div className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g., Advanced Mathematics"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="What will you learn in this course?"
              className="w-full px-4 py-2.5 bg-dark-800/50 border border-dark-600/50 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all resize-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>
              Create Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

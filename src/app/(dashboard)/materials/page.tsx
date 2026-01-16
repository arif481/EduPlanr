/**
 * Study Materials Page
 * CRUD interface for notes, links, and documents
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  LinkIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  TrashIcon,
  PencilIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Card, CardHeader, Button, Input, Badge, Modal } from '@/components/ui';
import { cn, formatSmartDate, truncate } from '@/lib/utils';
import { StudyMaterial, MaterialType } from '@/types';

// Mock data
const mockMaterials: StudyMaterial[] = [
  {
    id: '1',
    userId: '1',
    title: 'Calculus Integration Notes',
    content: '<p>Integration by parts, substitution, partial fractions...</p>',
    type: 'note',
    tags: ['calculus', 'math'],
    subjectId: '1',
    syllabusId: null,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    isFavorite: true,
    isArchived: false,
  },
  {
    id: '2',
    userId: '1',
    title: 'Khan Academy - Linear Algebra',
    content: 'https://www.khanacademy.org/math/linear-algebra',
    type: 'link',
    tags: ['linear-algebra', 'math', 'video'],
    subjectId: '1',
    syllabusId: null,
    url: 'https://www.khanacademy.org/math/linear-algebra',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    isFavorite: false,
    isArchived: false,
  },
  {
    id: '3',
    userId: '1',
    title: 'Physics Lab Report Template',
    content: '<p>Lab report structure and guidelines...</p>',
    type: 'document',
    tags: ['physics', 'template'],
    subjectId: '2',
    syllabusId: null,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 86400000),
    isFavorite: true,
    isArchived: false,
  },
  {
    id: '4',
    userId: '1',
    title: 'Data Structures Flashcards',
    content: '<p>Binary trees, hash tables, graphs...</p>',
    type: 'flashcard',
    tags: ['cs', 'algorithms'],
    subjectId: '3',
    syllabusId: null,
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 172800000),
    isFavorite: false,
    isArchived: false,
  },
];

const materialTypeConfig: Record<MaterialType, { icon: React.ElementType; color: string }> = {
  note: { icon: DocumentTextIcon, color: 'text-neon-cyan' },
  link: { icon: LinkIcon, color: 'text-neon-purple' },
  document: { icon: FolderIcon, color: 'text-neon-green' },
  flashcard: { icon: Squares2X2Icon, color: 'text-neon-yellow' },
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockMaterials);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MaterialType | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  // Delete material
  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
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
          <h1 className="text-3xl font-bold text-white font-display">Materials</h1>
          <p className="text-gray-400 mt-1">
            {materials.length} items • {materials.filter((m) => m.isFavorite).length} favorites
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Material
        </Button>
      </motion.div>

      {/* Filters and search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedType === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All
          </Button>
          {(Object.keys(materialTypeConfig) as MaterialType[]).map((type) => {
            const config = materialTypeConfig[type];
            return (
              <Button
                key={type}
                variant={selectedType === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedType(type)}
                leftIcon={<config.icon className="w-4 h-4" />}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </Button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-dark-800 rounded-xl p-1">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="!rounded-lg"
          >
            <Squares2X2Icon className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="!rounded-lg"
          >
            <ListBulletIcon className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      {/* Materials grid/list */}
      <AnimatePresence mode="wait">
        {filteredMaterials.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredMaterials.map((material, index) => {
                const TypeIcon = materialTypeConfig[material.type].icon;
                const typeColor = materialTypeConfig[material.type].color;

                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      hoverable
                      className="h-full cursor-pointer"
                      onClick={() => setSelectedMaterial(material)}
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn('p-2 rounded-xl bg-dark-700/50', typeColor)}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(material.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-dark-700/50 transition-colors"
                          >
                            {material.isFavorite ? (
                              <HeartSolidIcon className="w-5 h-5 text-neon-pink" />
                            ) : (
                              <HeartIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMaterial(material.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mt-4 line-clamp-2">
                        {material.title}
                      </h3>

                      {material.type === 'link' && material.url && (
                        <p className="text-sm text-gray-400 mt-1 truncate">
                          {material.url}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {material.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="default" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {material.tags.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{material.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-4">
                        Updated {formatSmartDate(material.updatedAt)}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredMaterials.map((material, index) => {
                const TypeIcon = materialTypeConfig[material.type].icon;
                const typeColor = materialTypeConfig[material.type].color;

                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-dark-700/30 transition-colors"
                      onClick={() => setSelectedMaterial(material)}
                    >
                      <div className={cn('p-2 rounded-xl bg-dark-700/50', typeColor)}>
                        <TypeIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {material.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {material.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                              {tag}
                            </Badge>
                          ))}
                          <span className="text-xs text-gray-500">
                            {formatSmartDate(material.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(material.id);
                          }}
                          className="p-2 rounded-lg hover:bg-dark-700/50 transition-colors"
                        >
                          {material.isFavorite ? (
                            <HeartSolidIcon className="w-5 h-5 text-neon-pink" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <Button variant="ghost" size="icon">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
                <DocumentTextIcon className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No materials found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Start adding study materials to organize your learning'}
              </p>
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<PlusIcon className="w-5 h-5" />}
              >
                Add Material
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add material modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Material"
        description="Create a new study material"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Material creation form would go here. Select type, add title, content, tags, etc.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>
              Create Material
            </Button>
          </div>
        </div>
      </Modal>

      {/* Material detail modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title={selectedMaterial?.title || ''}
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="neon">{selectedMaterial.type}</Badge>
              {selectedMaterial.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            {selectedMaterial.type === 'link' && selectedMaterial.url && (
              <a
                href={selectedMaterial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline"
              >
                {selectedMaterial.url}
              </a>
            )}

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedMaterial.content }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-dark-600/50">
              <Button
                variant="secondary"
                leftIcon={<PencilIcon className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                leftIcon={<TrashIcon className="w-4 h-4" />}
                onClick={() => {
                  deleteMaterial(selectedMaterial.id);
                  setSelectedMaterial(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

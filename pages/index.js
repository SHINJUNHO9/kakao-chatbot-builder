import React, { useState, useRef } from 'react';
import { Settings, Upload, Check, X, AlertCircle, Plus, Trash2, Image as ImageIcon, Type, List, MessageSquare } from 'lucide-react';

export default function KakaoChatbotBuilder() {
  // 기본 블록 구성
  const [blocks, setBlocks] = useState([
    { id: 'menu', name: '커스텀메뉴', type: 'menu', icon: '⚙️', fixed: true, completed: false },
    { id: 'welcome', name: '웰컴', type: 'card', icon: '👋', fixed: false, completed: false },
    { id: 'hospital', name: '병원정보', type: 'card', icon: '🏥', fixed: false, completed: false },
    { id: 'treatment', name: '진료정보', type: 'list', icon: '📋', fixed: false, completed: false },
    { id: 'doctor', name: '의료진소개', type: 'card', icon: '👨‍⚕️', fixed: false, completed: false },
    { id: 'caution', name: '주의사항', type: 'card', icon: '⚠️', fixed: false, completed: false },
    { id: 'booking', name: '예약안내', type: 'card', icon: '📅', fixed: false, completed: false },
    { id: 'consult', name: '상담원연결', type: 'text', icon: '💬', fixed: false, completed: false },
    { id: 'chatbot', name: '챗봇연결', type: 'card', icon: '🤖', fixed: false, completed: false },
    { id: 'news', name: '병원소식', type: 'card', icon: '📢', fixed: false, completed: false },
    { id: 'location', name: '오시는길', type: 'card', icon: '📍', fixed: false, completed: false },
    { id: 'hours', name: '진료시간', type: 'card', icon: '🕐', fixed: false, completed: false },
  ]);

  const [activeBlockId, setActiveBlockId] = useState('menu');
  const [editingBlock, setEditingBlock] = useState(null);

  // 제약조건
  const LIMITS = {
    card: {
      image: { width: 800, height: 400, maxSize: 500 * 1024 },
      title: 50,
      description: 230,
      button: { max: 14, count: 3 }
    },
    list: {
      header: 15,
      itemImage: { width: 180, height: 180, maxSize: 300 * 1024 },
      itemTitle: 30,
      itemDescription: 16,
      maxItems: 10
    },
    text: {
      noButton: 1000,
      withButton: 400
    },
    image: {
      image: { width: 800, height: 400, maxSize: 3200 * 1024 }
    }
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  // 블록 설정 모달
  const BlockSettingsModal = ({ block, onClose, onSave }) => {
    const [name, setName] = useState(block.name);
    const [type, setType] = useState(block.type);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
          <h3 className="text-lg font-bold mb-4">블록 설정</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">블록명</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                placeholder="블록명 입력"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">타입</label>
              <div className="space-y-2">
                {[
                  { value: 'card', label: '카드형' },
                  { value: 'list', label: '리스트형' },
                  { value: 'text', label: '텍스트형' },
                  { value: 'image', label: '이미지형' }
                ].map(t => (
                  <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="blockType"
                      value={t.value}
                      checked={type === t.value}
                      onChange={(e) => setType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => onSave({ ...block, name, type })}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg"
            >
              저장
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 rounded-lg"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CharCount = ({ current, max }) => (
    <span className={`text-xs ${current > max ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
      {current}/{max}
    </span>
  );

  const CustomMenuForm = () => {
    const [menuCount, setMenuCount] = useState(6);
    const [menus, setMenus] = useState(
      Array(6).fill(null).map((_, i) => ({
        icon: ['🏥', '📋', '💬', '⚠️', '📅', '🤖'][i] || '📌',
        name: ['병원정보', '진료정보', '상담연결', '주의사항', '예약하기', '챗봇연결'][i] || '',
        link: ['병원정보', '진료정보', '상담원연결', '주의사항', '예약안내', '챗봇연결'][i] || ''
      }))
    );

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">메뉴 개수 선택</label>
          <div className="flex gap-3">
            {[3, 4, 6].map(count => (
              <button
                key={count}
                onClick={() => {
                  setMenuCount(count);
                  setMenus(prev => prev.slice(0, count));
                }}
                className={`px-6 py-3 rounded-lg border-2 font-bold ${
                  menuCount === count
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                {count}칸
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {menus.slice(0, menuCount).map((menu, i) => (
            <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">아이콘</label>
                  <input
                    type="text"
                    value={menu.icon}
                    onChange={(e) => {
                      const newMenus = [...menus];
                      newMenus[i].icon = e.target.value;
                      setMenus(newMenus);
                    }}
                    className="w-full px-2 py-2 border-2 border-gray-200 rounded text-center text-xl"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">메뉴명 (14자)</label>
                  <input
                    type="text"
                    value={menu.name}
                    onChange={(e) => {
                      const newMenus = [...menus];
                      newMenus[i].name = e.target.value;
                      setMenus(newMenus);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                    maxLength={14}
                  />
                  <CharCount current={menu.name.length} max={14} />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">연결 블록</label>
                  <select
                    value={menu.link}
                    onChange={(e) => {
                      const newMenus = [...menus];
                      newMenus[i].link = e.target.value;
                      setMenus(newMenus);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    {blocks.filter(b => b.id !== 'menu').map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CardForm = () => {
    const [data, setData] = useState({
      title: '',
      description: '',
      buttons: [{ text: '', link: '' }]
    });

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">이미지 (800×400, 500KB 이하)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600">이미지 업로드 영역</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">타이틀</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
            placeholder="타이틀 입력"
          />
          <CharCount current={data.title.length} max={LIMITS.card.title} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">설명 (230자)</label>
          <textarea
            value={data.description}
            onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg h-24"
            placeholder="설명 입력"
          />
          <CharCount current={data.description.length} max={LIMITS.card.description} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">버튼 (최대 3개)</label>
          {data.buttons.map((btn, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={btn.text}
                onChange={(e) => {
                  const newButtons = [...data.buttons];
                  newButtons[i].text = e.target.value;
                  setData(prev => ({ ...prev, buttons: newButtons }));
                }}
                placeholder="버튼 텍스트 (14자)"
                maxLength={14}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={btn.link}
                onChange={(e) => {
                  const newButtons = [...data.buttons];
                  newButtons[i].link = e.target.value;
                  setData(prev => ({ ...prev, buttons: newButtons }));
                }}
                placeholder="블록명 또는 URL"
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg"
              />
            </div>
          ))}
          {data.buttons.length < 3 && (
            <button
              onClick={() => setData(prev => ({
                ...prev,
                buttons: [...prev.buttons, { text: '', link: '' }]
              }))}
              className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
            >
              + 버튼 추가
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (activeBlock.type === 'menu') return <CustomMenuForm />;
    if (activeBlock.type === 'card') return <CardForm />;
    return <div className="text-gray-500">이 타입의 폼은 개발 중입니다.</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r-2 border-gray-200 flex flex-col">
        <div className="p-4 border-b-2 border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">챗봇 콘텐츠 작성</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {blocks.map(block => (
            <div
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                activeBlockId === block.id
                  ? 'bg-yellow-100 border-2 border-yellow-400'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{block.icon}</span>
                <span className="text-sm">{block.name}</span>
              </div>
              {!block.fixed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBlock(block);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  ⚙️
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t-2 border-gray-200 space-y-2">
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 rounded-lg">
            임시저장
          </button>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg">
            제출하기
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {activeBlock.icon} {activeBlock.name}
            </h3>
            {renderForm()}
          </div>
        </div>
      </div>

      {editingBlock && (
        <BlockSettingsModal
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
          onSave={(updatedBlock) => {
            setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
            setEditingBlock(null);
          }}
        />
      )}
    </div>
  );
}
```

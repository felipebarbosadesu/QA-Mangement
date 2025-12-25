import { useState, useEffect } from 'react';

// Hook para gerenciar usuários salvos
export const useSavedUsers = () => {
  const [savedUsers, setSavedUsers] = useState<string[]>([]);

  useEffect(() => {
    const users = localStorage.getItem('qa_manager_users');
    if (users) {
      try {
        setSavedUsers(JSON.parse(users));
      } catch (e) {
        console.error('Erro ao carregar usuários:', e);
      }
    }
  }, []);

  const addUser = (userName: string) => {
    if (userName.trim() && !savedUsers.includes(userName.trim())) {
      const updatedUsers = [...savedUsers, userName.trim()];
      setSavedUsers(updatedUsers);
      localStorage.setItem('qa_manager_users', JSON.stringify(updatedUsers));
    }
  };

  const deleteUser = (userName: string) => {
    const updatedUsers = savedUsers.filter(u => u !== userName);
    setSavedUsers(updatedUsers);
    localStorage.setItem('qa_manager_users', JSON.stringify(updatedUsers));
  };

  return { savedUsers, addUser, deleteUser };
};

// Hook para gerenciar ambientes salvos
export const useSavedEnvironments = () => {
  const [savedEnvironments, setSavedEnvironments] = useState<string[]>(['QA', 'Beta']);

  useEffect(() => {
    const envs = localStorage.getItem('qa_manager_environments');
    if (envs) {
      try {
        const parsed = JSON.parse(envs);
        // Garante que QA e Beta sempre estejam presentes
        setSavedEnvironments([...new Set([...parsed, 'QA', 'Beta'])]);
      } catch (e) {
        console.error('Erro ao carregar ambientes:', e);
      }
    }
  }, []);

  const addEnvironment = (envName: string) => {
    if (envName.trim() && !savedEnvironments.includes(envName.trim())) {
      const updatedEnvs = [...savedEnvironments, envName.trim()];
      setSavedEnvironments(updatedEnvs);
      localStorage.setItem('qa_manager_environments', JSON.stringify(updatedEnvs));
      return true;
    }
    return false;
  };

  const deleteEnvironment = (envName: string) => {
    // Não permite excluir QA e Beta (padrões do sistema)
    if (envName === 'QA' || envName === 'Beta') {
      return false;
    }
    const updatedEnvs = savedEnvironments.filter(e => e !== envName);
    setSavedEnvironments(updatedEnvs);
    localStorage.setItem('qa_manager_environments', JSON.stringify(updatedEnvs));
    return true;
  };

  return { savedEnvironments, addEnvironment, deleteEnvironment };
};

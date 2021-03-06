import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/portfolio?${stringify(params)}`);
}

export async function queryMagic(params) {
  return request(`/api/magic?${stringify(params)}`);
}

export async function queryDividend(params) {
  return request(`/api/dividend?${stringify(params)}`);
}

export async function addDividend(params) {
  return request('/api/dividend', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeDividend(params) {
  return request('/api/dividend', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/portfolio_history', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

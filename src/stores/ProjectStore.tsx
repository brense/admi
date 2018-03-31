import { observable } from 'mobx';

class ProjectStore {

  @observable projects: {}[] = [
    { name: 'A Test project 1 test lorem ipsum', id: 'projectA' },
    { name: 'B Test project 2', id: 'projectB' },
    { name: 'Intern', id: 'intern' }
  ];

  findProject(id: string) {
    let match = {};
    this.projects.some((project: { id: string }) => {
      if (id === project.id) {
        match = project;
        return true;
      }
      return false;
    });
    return match as { name: string };
  }

}

export default new ProjectStore();

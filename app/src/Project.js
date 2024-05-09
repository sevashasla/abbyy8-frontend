import './Project.css';
import project_1 from './projects/data_1.json';
import project_2 from './projects/data_2.json';
import project_3 from './projects/data_3.json';

import path from 'path-browserify'
import React from 'react';

let allProjects = new Array();
allProjects.push(
  project_1, 
  project_2,
  project_3,
);

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.curr_project = allProjects[this.props.projectId];
    this.state = {onButton: false};
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  handleEnter () {
    this.setState((prevState) => {
      return {onButton: true};
    });
  }

  handleLeave () {
    this.setState((_) => {
      return {onButton: false};
    });
  }

  render() {
    return (
      <div class="project">
        <a class="project-link" onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} href={path.join("projects", this.curr_project["link"], "project.html")}>
            {this.state.onButton ? <img class="project-image-clicked" src={this.curr_project['image_path']}/> : <img class="project-image" src={this.curr_project['image_path']}/>}
        </a>
        <div class="project-name-desc-auth-code">
          <p class="project-name">
            {this.curr_project['name']}
          </p>
          <div class="project-authors">
            {this.curr_project['authors'].map(
              (author_name, idx) => {
                let ending = (idx + 1 == this.curr_project['authors'].length) ? "" : ", ";
                return (idx === this.curr_project['me_id']) ?
                (<span class="project-me">{author_name + ending}</span>) : (<span>{author_name + ending}</span>);
              }
            )}
          </div>
          <p class="project-desc">
            {this.curr_project['desc']}
          </p>

          <a href={this.curr_project["code"]} style={{
            marginTop: 'auto', marginBottom: 0, width: "10%", padding: "0.5%"
          }} class="button-6">code</a>
        </div>
      </div>
    );
  }
}

export default Project;
export const PROJECT_QUERY = `
  query Projects {
    projects(orderBy: date_DESC) {
      title
      summary
      description
      tags
      stack
      github
      demo
      photo {
        id
        url
      }
      date
    }
  }
`;

export const EXPERIENCE_QUERY = `
  query Experiences {
    experiences(orderBy: endDate_DESC) {
      id
      title
      entity
      photo {
        id
        url
      }
      description
      skill
      startDate
      endDate
    }
  }
`;

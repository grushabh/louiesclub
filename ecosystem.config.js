module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    {
      name: 'louiesclub API',
      script: 'build/main.js',
      instances: 1,
      exec_mode: "cluster",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
  ],

  deploy: {
    production: {
      key: "~/pems/louieclub.pem",
      user: 'ec2-user',
      host: '54.70.154.53',
      ref: 'origin/develop',
      repo: 'https://github.com/grushabh/louiesclub.git',
      path: '/home/ec2-user/server',
      "pre-setup": "curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash - && sudo yum -y install git gcc-c++ make && sudo yum -y install nodejs && npm install pm2 apidoc ",
      "post-setup": "ls -la",
      "post-deploy": 'npm install && npm run build && npm run apidoc &&  sudo pm2 reload ecosystem.config.js --env production'
    },
  }
};


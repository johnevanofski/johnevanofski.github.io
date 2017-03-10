var monsterBash = new Vue({
  el: '#app',
  data: {
    gameInit : false,
    gameActive : false,
    monsterHp : 100,
    playerHp : 100,
    playerDmg : 0,
    monsterDmg : 0,
    playerHeal : 0,
    status : [],
    playerImgState : 'static',
    monsterImgState : 'static',
    playerPos : 0,
    monsterPos : 0
  },
  watch: {
    playerHp: function() {
      if (this.playerHp < 1) {
        this.updateStatus('player', 0, 'death')
        this.playerHp = 0
      }
    },
    monsterHp: function() {
      if (this.monsterHp < 1) {
        this.updateStatus('monster', 0, 'death')
        this.monsterHp = 0
      }
    }
  },
  computed: {
  },
  methods: {
    startNewGame: function() {
      this.gameInit = !this.gameInit
      this.gameActive = true
      this.monsterHp = 100
      this.playerHp = 100
      this.status = []
      this.playerImgState = 'static'
      this.monsterImgState = 'static'
    },
    attack: function() {
      this.monsterAttack(8)
      this.playerDmg = this.computeStatus(5);
      this.updateStatus('player',this.playerDmg, 'attacks');
    },
    specialAttack: function() {
      this.monsterAttack(10)
      this.playerDmg = this.computeStatus(8);
      this.updateStatus('player',this.playerDmg, 'summons sun beam!');
    },
    heal: function() {
      this.monsterAttack(5)
      this.playerHeal = this.computeStatus(10,1);
      this.updateStatus('player',this.playerHeal, 'healed');
    },
    monsterAttack: function(str) {
      this.monsterDmg = this.computeStatus(str);
      this.updateStatus('monster',this.monsterDmg, 'attacks');
    },
    updateStatus: function(char, str, type) {
      vm = this

      if (type != 'death' && this.playerHp > 0 && this.monsterHp > 0) {
        // Player Attacks / Heals
        if (char == 'player') {

          if (type == 'healed' && (this.playerHp + str) < 100) {
            this.playerHp += str
            this.status.unshift({char:char, str:str, type:type})
          }
          else if (type != 'healed') {
            if (str > 0 ) this.animateAttack('player')
            this.monsterHp -= str
            this.status.unshift({char:char, str:str, type:type})
          }
        // Monster Attacks
        } else {
          setTimeout(function() {
            if (str > 0 ) vm.animateAttack('monster')
            vm.playerHp -= str
            vm.status.unshift({char:char, str:str, type:type})
          }, 800)
        }
      // Death
      } else {
        var dead = '';
        if (this.playerHp > 0) {
          dead = 'monster'
          this.monsterImgState = 'dead'
          this.monsterHp = 0
        }
        else {
          dead = 'player'
          this.playerImgState = 'dead'
          this.playerHp = 0
        }
        if (this.gameActive) {
          this.status.unshift({char:dead, str:str, type:'death'})
          this.gameActive = false
        }
      }
    },
    computeStatus: function(n, min) {
      var min = min || 0;
      return Math.floor((Math.random() * n) + min)
    },
    damageAmount: function(n) {
      if (n < 25) return 'danger'
      if (n < 50) return 'warning'
      else return 'success'
    },
    animateAttack: function(p) {
      vm = this
      if (p == 'player') {
        vm.playerPos = '30px'
        vm.monsterImgState = 'hit'
        setTimeout(function() {
          vm.playerPos = 0
          vm.monsterImgState = 'static'
        }, 600)
      } else if (p == 'monster') {
        vm.monsterPos = '-30px'
        vm.playerImgState = 'hit'
        setTimeout(function() {
          vm.monsterPos = 0
          vm.playerImgState = 'static'
        }, 600)
      }
    }
  }
})

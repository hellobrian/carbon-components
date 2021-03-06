import 'core-js/modules/es6.weak-map'; // For PhantomJS
import Loading from '../../src/components/loading/loading';
import LoadingHTML from '../../src/components/loading/loading.html';

describe('Test Loading', function() {
  describe('Constructor', function() {
    it('Should throw if root element is not given', function() {
      expect(() => {
        new Loading();
      }).to.throw(Error);
    });

    it('Should throw if root element is not a DOM element', function() {
      expect(() => {
        new Loading(document.createTextNode(''));
      }).to.throw(Error);
    });

    it('Should set default state to active', function() {
      const spinner = new Loading(document.createElement('div'));
      expect(spinner.isActive()).to.equal(true);
    });

    it('Should accept options', function() {
      const options = { active: false };
      const spinner = new Loading(document.createElement('div'), options);
      expect(spinner.isActive()).to.equal(false);
    });
  });

  describe('set()', function() {
    it('Should throw if boolean is not passed in', function() {
      const spinner = new Loading(document.createElement('div'));
      expect(() => spinner.set()).to.throw(Error);
      expect(() => spinner.set('true')).to.throw(Error);
    });

    it('Should set state', function() {
      const spinner = new Loading(document.createElement('div'));
      spinner.set(true);
      expect(spinner.isActive()).to.be.true;
      spinner.set(false);
      expect(spinner.isActive()).to.be.false;
    });

    it('Should return self', function() {
      const spinner = new Loading(document.createElement('div'));
      expect(spinner.set(true)).to.equal(spinner);
    });

    it('Should remove and add bx--loading--stop class attribute of DOM element', function() {
      const spinner = new Loading(document.createElement('div'));
      spinner.set(false);
      expect(
        spinner.element.classList.contains('bx--loading--stop'),
        'Class for stopped state'
      ).to.be.true;

      spinner.set(true);
      expect(
        spinner.element.classList.contains('bx--loading--stop'),
        'Class for started state'
      ).to.be.false;
    });
  });

  describe('toggle()', function() {
    it('Should toggle', function() {
      const spinner = new Loading(document.createElement('div'));
      spinner.toggle();
      expect(spinner.isActive()).to.equal(false);
      spinner.toggle();
      expect(spinner.isActive()).to.equal(true);
    });
  });

  describe('isActive()', function() {
    it('Should return spinner state', function() {
      const spinner = new Loading(document.createElement('div'));
      expect(spinner.isActive()).to.equal(true);
    });
  });

  describe('_deleteElement()', function() {
    let element;
    let instance;
    let wrapper;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = LoadingHTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-loading]');
      instance = new Loading(element);
    });

    it('Should be called', function() {
      const spy = sinon.spy(instance, '_deleteElement');
      instance._deleteElement();
      expect(spy).to.have.been.called;
    });

    it('Should remove loading element from the DOM', function() {
      instance._deleteElement();
      const loadingEl = document.querySelector('[data-loading]');
      expect(loadingEl).to.be.a('null');
    });

    afterEach(function() {
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('end()', function() {
    let element;
    let instance;
    let wrapper;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = LoadingHTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-loading]');
      instance = new Loading(element);
    });

    it('Should be called', function() {
      const spy = sinon.spy(instance, 'end');
      instance.end();
      expect(spy).to.have.been.called;
    });

    it('Should set state to inactive', function() {
      instance.end();
      expect(instance.isActive()).to.equal(false);
    });

    afterEach(function() {
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('Managing instances', function() {
    let element;

    before(function() {
      element = document.createElement('a');
    });

    it('Should prevent creating duplicate instances', function() {
      let first;
      let second;
      try {
        first = Loading.create(element);
        second = Loading.create(element);
        expect(first).to.equal(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });

    it('Should let create a new instance for an element if an earlier one has been released', function() {
      let first;
      let second;
      try {
        first = Loading.create(element);
        first.release();
        second = Loading.create(element);
        expect(first).not.to.equal(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });
  });
});

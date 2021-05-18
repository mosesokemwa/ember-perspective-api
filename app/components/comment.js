import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Perspective from 'perspective-api-client';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class CommentController extends Component {
  @tracked errors;
  @tracked writtenWords = 'fuck ';
  @inject config;

  @action
  async checkComment(text) {
    let res;
    if (this.writtenWords.length == 0) {
      this.errors = '';
    } else {
      const perspective = new Perspective({
        apiKey: this.config.get('PERSPECTIVE_API_KEY').PERSPECTIVE_API_KEY,
      });
      const result = await perspective.analyze({
        comment: { text },
        requestedAttributes: {
          TOXICITY: { scoreThreshold: 0.7 },
          IDENTITY_ATTACK: { scoreThreshold: 0.7 },
          UNSUBSTANTIAL: {},
        },
        spanAnnotations: true,
      });

      res = parseInt(
        result?.attributeScores?.TOXICITY?.summaryScore?.value * 100
      );
      console.log(JSON.stringify(result, null, 2));
    }
    this.errors = res;
    return res;
  }
}

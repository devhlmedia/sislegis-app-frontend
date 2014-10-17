package br.org.mj.sislegis.app.service;

import java.util.List;
import java.util.Map;

import javax.ejb.Local;

import br.org.mj.sislegis.app.model.Proposicao;

@Local
public interface ProposicaoService extends Service<Proposicao> {

	public List<Proposicao> buscarProposicoes(Map parametros);
}
